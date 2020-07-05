import {defineComponent} from "@vue/composition-api";
import {PlcProps} from "@/packages/table/plc/plc-utils";
import {plcSetup} from "@/packages/table/plc/plc";

export function definePlc<T>(
    {
        name,
        standardProps,
        customProps,
    }: {
        name: string,
        standardProps?: Partial<{ [k in keyof typeof PlcProps]: any }>,
        customProps?: T,
    }
) {

    let props = {
        ...Object.keys(PlcProps).reduce((ret, key) => {
            ret[key] = {
                ...PlcProps[key],
                ...(((standardProps || {})[key]) || {})
            }
            return ret
        }, {}),
        ...(customProps || {})
    }

    return defineComponent({
        name: `plc-${name}`,
        props,
        setup: (plcSetup as any)
    })
}