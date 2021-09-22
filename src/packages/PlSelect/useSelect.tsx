
import {createUseEditPopperAgent} from "../useEditPopperAgent/createAgentGetter";
import {PlSelectPanel} from "./PlSelectPanel";

export const useSelect = createUseEditPopperAgent({
    name: 'select',
    render: (attrs) => {
        return <PlSelectPanel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
        sizeEqual: true,
        arrow: false,
    },
    defaultRenderAttrs: {
        async onChange() {
            let renderAttrs: any = this.state.option.serviceOption.renderAttrs
            if (typeof renderAttrs === "function") renderAttrs = renderAttrs()
            /*非多选的情况下，默认点击关闭下拉框*/
            if (!renderAttrs.multiple) {
                this.hide()
            }
        }
    },
})
