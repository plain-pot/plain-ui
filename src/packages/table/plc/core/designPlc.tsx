import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {usePlc} from "./plc";
import {deepcopy} from "plain-utils/object/deepcopy";
import {ComponentPropsOptions, ExtractPropTypes} from 'vue';
import {VNodeChild} from "../../../../shims";
import {Plc} from "./plc.type";
import {TableNode} from "../../core/useTableNode";

export function designPlc<_,
    ExternalProps extends Readonly<ComponentPropsOptions> = {},
    TargetProps = ExtractPropTypes<typeof PlcProps & ExternalProps>,
    ExternalRefer = {},
    >(
    {
        name,
        render,
        standardProps,
        externalProps,
        setup,
    }: {
        name: string,
        standardProps?: Partial<{ [k in keyof typeof PlcProps]: any }>,
        externalProps?: ExternalProps,
        render: {
            head?: (scope: { plc: Plc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
            default?: (scope: { node: TableNode, plc: Plc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
            summary?: (scope: { node: TableNode, plc: Plc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
            edit?: (scope: { node: TableNode, plc: Plc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        },
        setup?: (props: TargetProps) => ExternalRefer,
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
                    return (render as any)[key]({...scope, refer: scope.plc.external, props: scope.plc.props})
                }
            }
        })
    }
    return designComponent({
        name,
        props: Object.assign(OptionProps, externalProps),
        setup({props}) {
            const {render, refer} = usePlc(props)
            if (!!setup) {
                const external = setup(props as any)
                Object.assign(refer, {external})
            }
            return {
                refer,
                render,
            }
        },
    })
}