import {getCurrentInstance} from "@vue/composition-api";

export function useRefer(ref: any) {
    const ctx = getCurrentInstance()
    Object.assign(ctx, ref)
    return ctx
}