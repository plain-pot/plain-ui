import {designComponent} from "../../use/designComponent";
import {nextTick, reactive} from 'vue';
import {MessageServiceDirection} from "./index";
import {useRefList} from "../../use/useRefList";
import Container from './message-container'

export default designComponent({
    name: 'pl-message-manager',
    setup() {

        const state = reactive({
            containers: [
                {
                    horizontal: MessageServiceDirection.center,
                    vertical: MessageServiceDirection.start,
                }] as { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }[]
        })
        const refs = useRefList<typeof Container.use.class>()

        const getContainer = async (config: { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }): Promise<typeof Container.use.class> => {
            for (let i = 0; i < refs.length; i++) {
                const ref = refs[i];
                if (ref.props.horizontal === config.horizontal && ref.props.vertical === config.vertical) {
                    return ref
                }
            }
            state.containers.push(config);
            await nextTick()
            return getContainer(config)
        }
        return {
            refer: {
                name: 'I am message controller',
                getContainer,
            },
            render: () => (
                <div class="pl-message-manager">
                    {state.containers.map((container, index) =>
                        <Container horizontal={container.horizontal}
                                   vertical={container.vertical}
                                   ref={(proxy: any) => refs[index] = proxy}/>)}
                </div>
            )
        }
    },
})