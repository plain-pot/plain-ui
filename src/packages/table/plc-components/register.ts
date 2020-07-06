import {defineComponent} from "@vue/composition-api";
import {PlcProps} from "@/packages/table/plc/plc-utils";
import {plcSetup} from "@/packages/table/plc/plc";

interface ParamMixin {
    name: string,
    props?: Partial<{ [k in keyof typeof PlcProps]: any } & { [k: string]: any }>,
}

export function definePlc<T extends ParamMixin>(
    mixin: T
) {
    let {name, props} = mixin
    props = Object.assign({}, PlcProps, props)

    return defineComponent({
        name,
        props: props as any,
        mixins: [mixin],
        setup: plcSetup
    })
}