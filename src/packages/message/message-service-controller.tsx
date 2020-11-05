import {designComponent} from "../../use/designComponent";
import {reactive, nextTick} from 'vue';
import MessageService from './message-service'
import {MessageServiceOption} from "./index";
import {useRefList} from "../../use/useRefList";

export default designComponent({
    name: 'pl-message-service-controller',
    setup() {

        const state = reactive({
            options: [] as MessageServiceOption[]
        })
        const refs = useRefList<{ option: MessageServiceOption }>()

        return {
            refer: {
                name: 'I am message service controller',
                getService: async (option: MessageServiceOption) => {
                    state.options.push(option)
                    await nextTick()
                    for (let i = 0; i < refs.length; i++) {
                        const ref = refs[i];
                        if (ref.option === option) {
                            return ref
                        }
                    }
                    return null
                },
            },
            render: () => (
                <div class="message-service-controller">
                    {state.options.map((option, index) =>
                        <MessageService option={option} ref={(proxy: any) => refs[index] = proxy}/>)}
                </div>
            )
        }
    },
})