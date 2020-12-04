import {createAgentGetter} from "../popper/edit/createAgentGetter";
import {App} from 'vue';

export const SelectServiceGetter = createAgentGetter({
    name: 'select',
    render: (attrs) => {
        return <pl-select-panel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
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

export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$select', {
                    get() {
                        const service = SelectServiceGetter(this)
                        return service
                    },
                })
            }
        })
    },
}