import {designComponent} from "../../use/designComponent";
import {VNodeChild} from "../../shims";

export function createDefaultService<Option extends object, Refer extends {
    isShow: { value: boolean },
    isOpen: { value: boolean },
    service: (optoin: Option) => void
}>
(
    {
        name,
        setup,
    }: {
        name: string,
        setup: (option: Option) => {
            refer: Refer,
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