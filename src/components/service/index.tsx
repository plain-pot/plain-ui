import {RefsMixinFactory} from "../../utils/mixins";

const PlainService = {
    generateController(name, ServiceComponent) {
        return {
            name,
            mixins: [RefsMixinFactory({
                items: Array,
            })],
            data() {
                return {
                    count: 1,
                }
            },
            render(h) {
                return (
                    <div class={name}>
                        {new Array(this.count).fill(0).map((item, index) => <ServiceComponent {...{key: index, ref: 'items', refInFor: true}}/>)}
                    </div>
                )
            },
            methods: {
                async getInstance() {
                    let service = this.items.find(item => (!item.showFlag && !item.openFlag) && !item.isPrivate)
                    if (!service) {
                        this.count++
                        await this.$plain.nextTick()
                        return this.getInstance()
                    } else {
                        return service
                    }
                },
            },
        }
    },

    install(Vue) {

    },
}

export default PlainService