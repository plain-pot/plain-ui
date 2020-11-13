import {designComponent} from "../../use/designComponent";
import {VNodeChild} from "../../shims";

export function createDefaultService<Option extends object>
(
    {
        name,
        setup,
    }: {
        name: string,
        setup: (option: Option) => {
            refer: {
                isShow: { value: boolean },
                isOpen: { value: boolean },
                service: (optoin: Option) => void
            },
            render: () => VNodeChild,
        },
    }
) {
    return designComponent({
        name: `pl-${name}-service`,
        props: {
            option: {type: Object, required: true}
        },
        setup({props}) {
            const option = props.option as Option
            const {render, refer} = setup(option)
            refer.service(option)
            return {
                render, refer
            }
        },
    })
}