import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {App} from 'vue';
import {PlColorPanel} from "../color-panel";

export const ColorPickerServiceGetter = createAgentGetter({
    name: 'color-picker',
    render(attrs: any) {
        return <PlColorPanel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        onChange() {this.hide()},
    },
})

export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$colorPicker', {
                    get() {
                        const service = ColorPickerServiceGetter(this)
                        return service
                    },
                })
            }
        })
    },
}