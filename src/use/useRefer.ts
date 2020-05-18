import {SetupContext} from "@vue/composition-api";

export function useRefer(context: SetupContext, ref: any): void {

    // @ts-ignore
    const refer: ((ref: any) => void) | { value: any } | undefined = context.attrs.refer

    if (!refer) {
        return
    }

    if (typeof refer === "function") {
        refer(ref)
    } else if (typeof refer === "object") {
        refer.value = ref
    }
}