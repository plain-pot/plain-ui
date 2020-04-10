import {RefsMixinFactory} from "../../utils/mixins";

/**
 * 生成一个service controller对象，用来生成service服务实例
 * @author  韦胜健
 * @date    2020/4/10 10:53
 */
function factory(name: string, ServiceComponent: any) {
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
}

function service() {

}

function agent() {

}

class PlainService {
    static factory = factory

}

export default PlainService