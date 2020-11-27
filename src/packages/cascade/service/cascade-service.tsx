import {createAgentGetter} from "../../popper/edit/createAgentGetter";
import './cascade-service.scss'
import {App} from 'vue';
import {delay} from 'plain-utils/utils/delay';

export const CascadeServiceGetter = createAgentGetter({
    name: 'cascade',
    render(attrs) {
        return <pl-cascade-panel {...attrs}/>
    },
    defaultPopperAttrs: {
        transition: 'pl-transition-popper-drop',
    },
    defaultRenderAttrs: {
        async onChange() {
            if (!(this.state.option.serviceOption.renderAttrs as any).selectBranch) {
                // 因为change之后，会引发 cascade panels 重新渲染没有宽度以及高度，导致过度动画失效，这里再change之后延迟再关闭
                await delay(120)
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