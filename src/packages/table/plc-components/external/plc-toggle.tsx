import {definePlc, getBinding} from "@/packages/table/plc-components/register";
import {TableRenderData} from "@/packages/table/plc/plc";

export default definePlc({
    name: 'plc-toggle',
    props: {
        addEditPadding: {default: true},
        summary: {
            type: Function,
            default: null
        },
        default: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                return (
                    <pl-toggle disabled {...getBinding(row, plc.props.field!)} trueValue={'Y'} falseValue={'N'}/>
                )
            }
        },
        edit: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                return (
                    <pl-toggle {...getBinding(row, plc.props.field!)} trueValue={'Y'} falseValue={'N'}/>
                )
            }
        },
    },
})