import {getComponents} from '../index'

export default {
    name: "pl-render-func",
    components: {
        ...(getComponents())
    },
    props: {
        renderFunc: {
            type: Function,
            required: true
        },
        data: {
            type: Object,
        },
    },
    render(h) {
        return (
            <div class="pl-render-func">
                {!!this.renderFunc && this.renderFunc.call(this.$parent._renderProxy, h, this.data)}
            </div>
        )
    },
}
