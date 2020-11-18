import {getCurrentInstance, onUpdated, reactive, ComponentInternalInstance} from 'vue'
import {VNodeChild} from "../shims";

type SlotFunction = ((vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean }

type SlotsData<T extends string> = {
    slots: { default: SlotFunction } & { [k in T]: SlotFunction }
}

function getExist(prevState: { [k: string]: boolean } | null, slotNames: string[], ctx: ComponentInternalInstance) {
    if (!prevState) {
        prevState = {}
    }
    slotNames.forEach((slotName) => {
        prevState![slotName] = !!ctx.slots[slotName]
    })
    return prevState
}

/**
 * 规范插槽用法
 * @author  韦胜健
 * @date    2020/11/18 17:48
 * @param   names                   插槽名称
 * @param   config
 *          config.makeReactive     是否需要 isExist具备响应式的能力，以便在computed、watch以及render中判断
 */
export function useSlots<T extends string>(names?: T[], config?: { makeReactive?: boolean }): SlotsData<T> {

    config = config || {}
    const {makeReactive} = config

    const ctx = getCurrentInstance()!
    const slotNames = [...(names || []), 'default']

    /**
     * 因为ctx.slots,ctx.ctx.$slots都不是响应式属性，无法触发computed以及watch中的变化，这里做一个手动更新处理
     * 每次beforeUpdate打补丁之前，先更新ctxSlots响应式变量，render函数只会触发一次；
     * @author  韦胜健
     * @date    2020/10/19 11:36
     */
    const state = reactive({
        exist: getExist(null, slotNames, ctx)
    })

    /*如果需要响应式，则需要设置 makeReactive，会自动在updated之后更新slots的isExist值*/
    if (makeReactive) {
        /*onUpdated(() => {
            getExist(state.exist, slotNames, ctx)
        })*/
    }

    /*slots.***是一个函数，参数是插槽后备内容。当插槽不存在时，渲染后备内容，否则渲染插槽内容*/
    let slots = slotNames.reduce((prev: any, slotName: string) => {
        prev[slotName] = Object.assign((vnode: VNodeChild) => {
            const slot = ctx.slots[slotName]
            return !!slot ? slot() : vnode
        }, {
            isExist() {
                return state.exist[slotName]
            }
        })
        return prev
    }, {} as SlotsData<T>["slots"])

    return {
        slots,
    }
}