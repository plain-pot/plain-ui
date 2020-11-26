import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {App} from 'vue';

const ColorPickerServiceGetter = createAgentGetter({
    name: 'cascade',
    render(attrs: any) {
        return <pl-color-panel{...attrs}/>
    },
    defaultRenderAttrs: {
        onChange() {
            console.log('color panel change')
        },
    },
})


export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$colorPicker', {
                    get() {
                        const $colorPicker = ColorPickerServiceGetter(this)
                        return $colorPicker
                    },
                })
            }
        })
    },
}