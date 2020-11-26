import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import {App} from 'vue';

const ColorPickerServiceGetter = createAgentGetter({
    name: 'cascade',
    render: (attrs: any) => (<pl-color-panel{...attrs}/>)
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