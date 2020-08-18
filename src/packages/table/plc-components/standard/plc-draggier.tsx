import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-draggier',
    props: {

        autoFixedLeft: {default: true},
        order: {default: -9998},
        width: {default: 40},
        align: {default: 'center'},
        head: {
            type: Function,
            default: function () {
                return null
            }
        },
        summary: {
            type: Function,
            default: function () {
                return null
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}) {
                return (
                    <pl-button icon="el-icon-rank" size="normal" mode="text" class="plc-draggier-handler"/>
                )
            }
        },
    },
    setup(props) {
        return {}
    },
})