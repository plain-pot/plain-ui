import {defineComponent, set} from "@vue/composition-api";
import {PlcProps} from "@/packages/table/plc/plc-utils";
import {plcSetup} from "@/packages/table/plc/plc";

import {useRefer} from "@/use/useRefer";

interface ParamMixin {
    name: string,
    props?: Partial<{ [k in keyof typeof PlcProps]: any } & { [k: string]: any }>,
    setup?: (props: ExtractPropTypes<typeof PlcProps>) => object
}

export function definePlc<T extends ParamMixin>(
    PlcComponent: T
) {
    let {name, props, setup, ...mixin} = PlcComponent
    props = Object.assign({}, PlcProps, props)

    return defineComponent({
        name,
        props: props as any,
        setup: (setupProps: any) => {
            if (!!setup) {
                const external = setup(setupProps)
                useRefer(external)
            }
            return plcSetup(setupProps)
        },
        mixins: [mixin],
    })
}

export function getBinding(row: any, field: string) {
    return {
        props: {
            value: row[field]
        },
        on: {
            input: val => {
                if (row.hasOwnProperty(field)) {
                    row[field] = val
                } else {
                    set(row, field, val)
                }
            }
        },
    }
}