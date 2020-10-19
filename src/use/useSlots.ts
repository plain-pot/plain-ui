import {getCurrentInstance, reactive, onBeforeUpdate, VNode} from 'vue'

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void | JSX.Element;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
type SlotFunctionType = (vnode?: VNodeChild) => any
type SlotsData<T> = {
    slots: { default: SlotFunctionType } & { [k in keyof T]: SlotFunctionType }
} & {
    $slots: { default?: VNodeChild } & { [k in keyof T]?: VNodeChild }
}

function createSlots<T extends {
    [k: string]: (...args: any[]) => any
}>(options: T): SlotsData<T> {

    const ctx = getCurrentInstance()!
    const slotNames = [...Object.keys(options), 'default']

    /**
     * 因为ctx.slots,ctx.ctx.$slots都不是响应式属性，无法触发computed以及watch中的变化，这里做一个手动更新处理
     * 每次beforeUpdate打补丁之前，先更新ctxSlots响应式变量，render函数只会触发一次；
     * @author  韦胜健
     * @date    2020/10/19 11:36
     */
    const ctxSlots = reactive(slotNames.reduce((prev: any, slotName) => (prev[slotName] = ctx.slots[slotName] || null, prev), {}) as any)
    onBeforeUpdate(() => slotNames.forEach(slotName => ctxSlots[slotName] = ctx.slots[slotName] || null))

    /*$slots.***用来获取slots.***函数执行后的结果，同时也可以用来判断是否存在某个插槽，因为这个是响应式变量*/
    let $slots: SlotsData<T>["$slots"] = {}
    /*slots.***是一个函数，参数是插槽后备内容。当插槽不存在时，渲染后备内容，否则渲染插槽内容*/
    let slots: SlotsData<T>["slots"] = {} as any;

    slotNames.forEach(key => {
        Object.defineProperty($slots, key, {
            get() {
                return !!ctxSlots[key] ? ctxSlots[key]!() : null
            },
        });
        (slots as any)[key] = (vnode: VNodeChild) => {
            const slot = $slots[key]
            return !!slot ? slot : vnode
        }
    })

    return {
        slots,
        $slots,
    }
}

export const useSlots = Object.assign(createSlots, {
    Slot: () => ({} as any),
})