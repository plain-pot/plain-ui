import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-toggle',
    props: {
        type: Function,
        summary: {
            default: null
        },
        default: {
            type: Function,
            default: function (h, {rowData, plc}) {
                return (
                    <pl-toggle disabled/>
                )
            }
        },
        edit: {
            type: Function,
            default: function (h, {rowData, plc}) {
                return (
                    <pl-toggle/>
                )
            }
        },
    },
})