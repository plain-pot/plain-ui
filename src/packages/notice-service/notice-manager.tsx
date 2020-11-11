import {designComponent} from "../../use/designComponent";
import {NoticeServiceDirection} from "./index";
import {nextTick, reactive} from 'vue';
import {useRefList} from "../../use/useRefList";
import Container from "./notice-container";

export default designComponent({
    name: 'pl-notice-manager',
    setup() {

        const state = reactive({
            containers: [
                {
                    horizontal: NoticeServiceDirection.end,
                    vertical: NoticeServiceDirection.start,
                }] as { horizontal: NoticeServiceDirection, vertical: NoticeServiceDirection }[]
        })

        const refs = useRefList<typeof Container.use.class>()

        const getContainer = async (config: { horizontal: NoticeServiceDirection, vertical: NoticeServiceDirection }): Promise<typeof Container.use.class> => {
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
                name: 'I am notice controller',
                getContainer,
            },
            render: () => (
                <div class="pl-notice-manager">
                    {state.containers.map((container, index) =>
                        <Container horizontal={container.horizontal}
                                   vertical={container.vertical}
                                   ref={(proxy: any) => refs[index] = proxy}/>)}
                </div>
            )
        }
    },
})