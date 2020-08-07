import {definePlc, getBinding} from "@/packages/table/plc-components/register";
import {TableRenderData} from "@/packages/table/plc/plc";

export default definePlc({
    name: 'plc-rate',
    props: {
        summary: {
            type: Function,
            default: null
        },
        default: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                return (
                    <pl-rate disabled {...getBinding(row, plc.props.field!)}/>
                )
            }
        },
        edit: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                return (
                    <pl-rate {...getBinding(row, plc.props.field!)}/>
                )
            }
        },
    },
})