import './cascade-service.scss'
import {createPopperServiceComponent} from "../useEditPopperAgent/createPopperServiceComponent";
import {createUseEditPopperAgent} from "../useEditPopperAgent/createAgentGetter";
import PlCascadePanel from "./index";
import {delay} from "plain-utils/utils/delay";


export const useCascade = createUseEditPopperAgent({
    name: 'cascade',
    render(attrs) {
        return <PlCascadePanel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        async onChange() {
            let renderAttrs: any = this.state.option.serviceOption.renderAttrs
            if (typeof renderAttrs === "function") renderAttrs = renderAttrs()
            if (!renderAttrs.selectBranch) {
                // 因为change之后，会引发 cascade panels 重新渲染没有宽度以及高度，导致过度动画失效，这里再change之后延迟再关闭
                await delay(120)
                this.hide()
            }
        },
    },
})
