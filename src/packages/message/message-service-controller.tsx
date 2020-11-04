import {designComponent} from "../../use/designComponent";
import {reactive} from 'vue';
import MessageService from './message-service'
import {MessageServiceOption} from "./index";

export default designComponent({
    name: 'pl-message-service-controller',
    setup() {

        const state = reactive({
            options: [] as MessageServiceOption[]
        })


        return {
            refer: {
                getService() {
                    return {}
                },
            },
            render: () => (
                <div class="message-service-controller">
                    {state.options.map(option => <MessageService option={option}/>)}
                </div>
            )
        }
    },
})