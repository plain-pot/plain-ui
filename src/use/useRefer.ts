import {SetupContext} from "@vue/composition-api";
import {$plain} from "@/packages/base";

const map = new WeakMap()

export function getCtx(context: SetupContext): SetupContext['root'] {
    let ctx = map.get(context)
    if (!!ctx) {
        return ctx
    } else {
        const {attrs, parent} = context
        if (!parent) {
            console.log(context)
            throw new Error('parent not exist!')
        }
        return $plain.utils.findOne(parent.$children, child => child.$attrs === attrs)
    }
}

export function useRefer(context: SetupContext, ref: any): void {
    const ctx = getCtx(context)
    Object.assign(ctx, ref)
}