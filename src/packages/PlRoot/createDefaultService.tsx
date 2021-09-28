/**
 * 创建一个默认的root service组件
 * 这个组件最后返回的refer，必须含有isShow、isOpen、service三个属性。
 * isShow：当前是否已经显示，因为存在过渡动画，所以如果值为true，但是此时在页面可能没有完全显示。值为false，可能在页面上没有完全隐藏；
 * isOpen：当前是否已经在页面上完全打开或者消失。值为true，表示当前已经完全显示，但是此时isShow可能为false。因为隐藏过渡动画没有结束的时候就是这种情况、同理isOpen为true的时候也是这样。
 * 只有当isShow以及isOpen都是false的情况下，这个service才是处于闲置可以服用的状态。
 *
 * @author  韦胜健
 * @date    2020/11/26 9:24
 */
import {designComponent, VueNode} from "plain-design-composition";

export function createDefaultService<Option extends Record<string, any>, Refer extends {
    isShow: { value: boolean },
    isOpen: { value: boolean },
    service: (optoin: Option) => void
}>
(
    {
        name,
        setup,
    }: {
        name: string,
        setup: (option: Option) => {
            refer: Refer,
            render: () => VueNode,
        },
    }
) {
    return designComponent({
        name: `pl-${name}-service`,
        props: {
            option: {type: Object, required: true}
        },
        setup({props}) {
            const option = props.option as Option
            const {render, refer} = setup(option)
            refer.service(option)
            return {
                render, refer
            }
        },
    })
}
