import {getCurrentInstance} from "@vue/composition-api";

export function useRefer(ref: any): void {
    const ctx = getCurrentInstance()
    Object.assign(ctx, ref)
}