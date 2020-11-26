import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {App} from 'vue';

const ColorPickerServiceGetter = createAgentGetter({
    name: 'color-picker',
    render(attrs: any) {
        return <pl-color-panel{...attrs}/>
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