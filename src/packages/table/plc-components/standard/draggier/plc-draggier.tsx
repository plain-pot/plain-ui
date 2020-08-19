import {definePlc} from "@/packages/table/plc-components/register";
import {useListDraggier} from "@/packages/table/plc-components/standard/draggier/use-list-draggier";
import {injectTable} from "@/packages/table/table/table";

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
            default: function ({plc}) {
                return (
                    <pl-button icon="el-icon-rank"
                               size="normal"
                               mode="text"
                               class="plc-draggier-handler"
                               {...{
                                   nativeOn: {
                                       mousedown: (plc.ctx as any).draggierPlc.handler.mousedown
                                   }
                               }}
                    />
                )
            }
        },
    },
    setup(props) {

        const {dataModel} = injectTable()

        const {handler} = useListDraggier({
            rowClass: 'plt-row',
            onChange: async (start, end) => {
                dataModel.value.splice(end, 0, dataModel.value.splice(start, 1)[0])
            }
        })

        return {
            draggierPlc: {
                handler,
            }
        }
    },
})