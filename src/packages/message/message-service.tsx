import {designComponent} from "../../use/designComponent";
import {MessageServiceOption} from "./index";

export default designComponent({
    name: 'pl-message-service',
    props: {
        option: {type: Object as any as new() => MessageServiceOption, required: true}
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pl-message-service">
                    {props.option.message}
                </div>
            )
        }
    },
})