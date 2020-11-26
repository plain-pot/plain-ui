import {VNodeChild} from "../../../shims";
import {PopperAgent} from "./utils";
import {reactive, ComponentPublicInstance} from 'vue';

export function createAgentGetter(
    {
        render,
    }: {
        render: (attrs: any) => VNodeChild,
    }
) {
    return (ins: ComponentPublicInstance) => {
        return (): PopperAgent => {
            const agentState = reactive({})
            return {
                isShow: false,
                isOpen: false,
                show: () => {/*do nothing*/},
                hide: () => {/*do nothing*/},
                toggle: () => {/*do nothing*/},
                destroy: () => {/*do nothing*/},
            }
        }
    }
}

const CascadeAgentGetter = createAgentGetter({
    render: (attrs: any) => (
        <pl-cascade-panel
            {...attrs}
        />
    )
})

const $cascade = CascadeAgentGetter({} as ComponentPublicInstance)

const agent = $cascade()