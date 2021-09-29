import {inject, provide} from "plain-ui-composition"
import {SimpleFunction} from "plain-ui-composition"

const REFRESH_POPPER_REFERENCE = '@@REFRESH_POPPER_REFERENCE'

/**
 * 因为 Popper 是无根节点，所以比较难检测到reference节点变化的情况。为了优化这一块的内容
 * 有两种方式，一种是在使用Popper组件的时候，reference包裹一层不变的节点，缺点是会破坏无根
 * 节点的结构。另一种是，提供一个 refreshPopperReference 函数，子组件可以注入这个函数，当子组件
 * 知道自己的reference节点变化之后调用这个函数通知Popper重新reference。
 *
 * @author  韦胜健
 * @date    2020/11/19 11:00
 */
export const refreshPopperReference = {
    provide: (refresh: SimpleFunction) => {
        provide(REFRESH_POPPER_REFERENCE, refresh)
    },
    inject: (defaultValue = null) => {
        const refresh = inject(REFRESH_POPPER_REFERENCE, defaultValue) as null | SimpleFunction
        return {
            freshPopperReference: () => !!refresh && refresh()
        }
    },
}
