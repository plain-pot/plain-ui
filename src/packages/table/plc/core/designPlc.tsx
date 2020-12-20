import {designComponent} from "../../../../use/designComponent";
import {PlcProps, PlcPropsDefault, PlcPropsEdit, PlcPropsHead, PlcPropsSummary} from "./plc.utils";
import {usePlc} from "./plc";
import {deepcopy} from "plain-utils/object/deepcopy";
import {ComponentPropsOptions} from 'vue';

export function designPlc<ExternalProps extends Readonly<ComponentPropsOptions> = {}>(
    {
        name,
        render,
        standardProps,
        externalProps,
    }: {
        name: string,
        standardProps?: Partial<{ [k in keyof typeof PlcProps]: any }>,
        externalProps?: ExternalProps,
        render: {
            head?: PlcPropsHead,
            default?: PlcPropsDefault,
            summary?: PlcPropsSummary,
            edit?: PlcPropsEdit,
        },
    }
) {
    const OptionProps = deepcopy(PlcProps)
    if (!!standardProps) {
        Object.entries(OptionProps).map(([key, value]) => {
            if (!!(standardProps as any)[key]) {
                Object.assign(value, (standardProps as any)[key])
            }
            if (!!(render as any)[key]) {
                (value as any).default = function (scope: any) {
                    return (render as any)[key](scope)
                }
            }
        })
    }
    return designComponent({
        name,
        props: Object.assign(OptionProps, externalProps),
        setup({props}) {
            const {render, refer} = usePlc(props)
            return {
                refer,
                render,
            }
        },
    })
}