import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {usePlc} from "./plc";
import {deepcopy} from "plain-utils/object/deepcopy";
import {ComponentInternalInstance, ComponentPropsOptions, ExtractPropTypes} from 'vue';
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
        standardProps,
        externalProps,
        setup,
    }: {
        name: string,
        standardProps?: Partial<{ [k in keyof typeof PlcProps]: any }>,
        externalProps?: ExternalProps,
        setup?: (props: TargetProps, ctx: ComponentInternalInstance) => ExternalRefer,
    },
    render?: {
        head?: (scope: { plc: Plc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        default?: (scope: { node: TableNode, plc: Plc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        summary?: (scope: { node: TableNode, plc: Plc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        edit?: (scope: { node: TableNode, plc: Plc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
    },
) {
    const OptionProps = deepcopy(PlcProps)

    Object.entries(OptionProps).map(([key, value]) => {
        if (!!standardProps && !!(standardProps as any)[key]) {
            Object.assign(value, (standardProps as any)[key])
        }
        if (!!(render as any)[key]) {
            (value as any).default = function (scope: any) {
                return (render as any)[key]({
                    ...scope,
                    refer: !scope.plc.externalRefer ? null : scope.plc.externalRefer(),
                    props: scope.plc.props
                })
            }
        }
    })

    return designComponent({
        name,
        props: {
            ...OptionProps,
            ...(externalProps || {}),
        },
        setup({props, ctx}) {
            const {render, refer} = usePlc(props)
            if (!!setup) {
                const externalRefer = setup(props as any, ctx!)
                Object.assign(refer, {externalRefer: () => externalRefer})
            }
            return {
                refer,
                render,
            }
        },
    })
}