import {getCurrentInstance, reactive, onBeforeUpdate, VNode} from 'vue'

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

type SlotFunction = ((vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean }

type SlotsData<T extends string> = {
    slots: { default: SlotFunction } & { [k in T]: SlotFunction }
}

export function useSlots<T extends string>(names?: T[]): SlotsData<T> {

    const ctx = getCurrentInstance()!
    const slotNames = [...(names || []), 'default']

    /**
     * 因为ctx.slots,ctx.ctx.$slots都不是响应式属性，无法触发computed以及watch中的变化，这里做一个手动更新处理
     * 每次beforeUpdate打补丁之前，先更新ctxSlots响应式变量，render函数只会触发一次；
     * @author  韦胜健
     * @date    2020/10/19 11:36
     */
    const ctxSlots = reactive(slotNames.reduce((prev: any, slotName) => (prev[slotName] = ctx.slots[slotName] || null, prev), {}) as any)
    onBeforeUpdate(() => slotNames.forEach(slotName => ctxSlots[slotName] = ctx.slots[slotName] || null))

    /*slots.***是一个函数，参数是插槽后备内容。当插槽不存在时，渲染后备内容，否则渲染插槽内容*/
    let slots = slotNames.reduce((prev: any, slotName: string) => {
        prev[slotName] = Object.assign((vnode: VNodeChild) => {
            const slot = ctxSlots[slotName]
            return !!slot ? slot() : vnode
        }, {
            isExist() {
                return !!ctxSlots[slotName]
            }
        })
        return prev
    }, {} as SlotsData<T>["slots"])

    return {
        slots,
    }
}