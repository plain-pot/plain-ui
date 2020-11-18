import {getCurrentInstance, onBeforeUpdate, reactive} from 'vue'
import {VNodeChild} from "../shims";
import {getSlotExist} from "../utils/getSlotExists";

type SlotFunction = ((vnode?: VNodeChild) => VNodeChild)
type SlotObject = { isExist: () => boolean }

interface UseSlots {
    <T extends string>(names?: T[]): {
        slots: { default: SlotFunction } & { [k in T]: SlotFunction }
    }

    <T extends string>(names?: T[], makeReactive?: boolean): {
        slots: { default: SlotFunction & SlotObject } & { [k in T]: SlotFunction & SlotObject }
    }
}

/**
 * 规范插槽用法
 * @author  韦胜健
 * @date    2020/11/18 17:48
 * @param   names                   插槽名称
 * @param   makeReactive            是否需要 isExist具备响应式的能力，以便在computed、watch以及render中判断
 */
export const useSlots: UseSlots = (names?: string[], makeReactive?: boolean) => {

    const ctx = getCurrentInstance()!
    const slotNames = [...(names || []), 'default']

    /**
     * 因为ctx.slots,ctx.ctx.$slots都不是响应式属性，无法触发computed以及watch中的变化，这里做一个手动更新处理
     * 每次beforeUpdate打补丁之前，先更新ctxSlots响应式变量，render函数只会触发一次；
     * @author  韦胜健
     * @date    2020/10/19 11:36
     */
    const state = reactive({exist: getSlotExist(null, slotNames, ctx)})

    /*如果需要响应式，则需要设置 makeReactive，会自动在updated之后更新slots的isExist值*/
    if (makeReactive) {
        onBeforeUpdate(() => {
            getSlotExist(state.exist, slotNames, ctx)
        })
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
    }, {} as any)

    return {
        slots,
    }
}