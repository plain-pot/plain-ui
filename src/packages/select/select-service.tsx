import {createAgentGetter} from "../popper/edit/createAgentGetter";
import {App} from 'vue';

const SelectServiceGetter = createAgentGetter({
    name: 'select',
    render: (attrs) => {
        return <pl-select-panel {...attrs}/>
    },
    defaultRenderAttrs: {
        async onChange(val) {
            console.log('change', val)
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