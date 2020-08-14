import {computed, defineComponent, getCurrentInstance} from "@vue/composition-api";
import {getCellClass, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlcType} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {PlcRender} from "@/packages/table/table-bak/render";
import {injectTable} from "@/packages/table/table/table";
import {StyleType} from "@/types/utils";

interface BodyCellPropsType {
    plc: PlcType,
    rowData: TableNode,
    isSummary: boolean
}

export default defineComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object, required: true},
        rowData: {type: TableNode, required: true},
        fixed: {type: String, required: true},
        isSummary: {type: Boolean},
    },
    setup(props: BodyCellPropsType) {

        const table = injectTable()
        const ctx = getCurrentInstance()!

        const renderData = computed(() => PlcRender.body({
            ...props,
            ctx,
        }))

        const classes = computed(() => {
            return [
                'plt-cell',
                'plt-body-cell',
                ...getCellClass(props.plc, props.rowData),
                {
                    'plt-cell-add-edit-padding': props.plc.props.addEditPadding,
                    'plt-cell-editing': renderData.value.editable,
                }
            ]
        })

        const styles = computed(() => {
            const height = `${table.propsState.bodyRowHeight}px`
            const width = `${(props.plc).props.width}px`
            return {
                height,
                width,
            }
        })

        const cellStyles = computed(() => {
            const ret = {} as StyleType
            if (props.plc.props.fixed !== PlcFixedType.center) {
                ret.position = 'sticky'
                ret.left = '0'
                ret.zIndex = '3'
            }
            return ret
        })

        const text = computed(() => {
            return !!props.plc.props.field ? props.rowData.data[props.plc.props.field] : null
        })

        return () => {
            return (
                <td colspan={1}
                    rowspan={1}
                    title={text.value}
                    class={classes.value}
                    style={cellStyles.value}
                >
                    <div style={styles.value}
                         class={classes.value}>
                        {renderData.value.body}
                    </div>
                </td>
            )
        }
    },
})