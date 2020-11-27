import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import './cascade-service.scss'
import {App} from 'vue';

export const CascadeServiceGetter = createAgentGetter({
    name: 'cascade',
    render(attrs) {
        return <pl-cascade-panel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        onChange() {
            if (!(this.state.option.serviceOption.renderAttrs as any).selectBranch) {
                this.hide()
            }
        },
    },
})

export default {
    install(app: App) {
        app.mixin({
            beforeCreate(): void {
                Object.defineProperty(this, '$cascade', {
                    get() {
                        const service = CascadeServiceGetter(this)
                        return service
                    },
                })
            }
        })
    },
}