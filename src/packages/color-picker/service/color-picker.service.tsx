import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {App} from 'vue';

const ColorPickerServiceGetter = createAgentGetter({
    name: 'cascade',
    render(attrs: any) {
        return <pl-color-panel{...attrs}/>
    },
    defaultRenderAttrs: {
        onChange(...args) {
            console.log('defaultRenderAttrs onChange', {context: this, args})
        },
    },
    defaultPopperAttrs: {
        onOpen() {
            console.log('defaultRenderAttrs onOpen', {context: this})
        },
    },
})


export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$colorPicker', {
                    get() {
                        return ColorPickerServiceGetter(this)
                    },
                })
            }
        })
    },
}