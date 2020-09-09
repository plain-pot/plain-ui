import {computed, defineComponent} from "@vue/composition-api";
import {PlcType} from "@/packages/table/plc/plc";
import {injectTable} from "@/packages/table/table/table";
import {PlcRender} from "@/packages/table/table/render";
import {useHeadCellResize} from "@/packages/table/table/head/useHeadCellResize";
import {useColDraggier} from "@/packages/table/table/head/useColDraggier";
import {$plain} from "@/packages/base";
import {stickyFlag} from "@/packages/table/plc/plc-utils";
import {toArray} from "@/util/util";
import {Table} from "@/packages/table/table";

export default defineComponent({
    name: 'plt-head-cell',
    props: {
        plc: {type: Object},
    },
    setup(props: { plc: PlcType }) {

        const table = injectTable()

        const {resizeHandler} = useHeadCellResize(table, props.plc)

        /**
         * 给 head-cell 加一个key，当 plc的props变化之后，head-cell节点会更新为新的节点，触发 scroll 的 ObjectServer事件，从而刷新滚动条宽度
         * @author  韦胜健
         * @date    2020/6/11 11:03
         */
        const key = computed(() => {
            const plc = props.plc
            return Object.keys(plc.props).reduce((ret, key) => {
                ret += `_${key}=${plc.props[key] || ''}`
                return ret
            }, '')
        })


        const cellStyles = computed(() => props.plc.styles.head.cell)
        const innerCellStyles = computed(() => props.plc.styles.head.innerCell)
        const cellClasses = computed(() => {
            const classes = toArray(props.plc.classes.head.cell || {}) as Table.Classes[]

            if (!!table.props.headCellClassFunc) {
                const headCellClasses = table.props.headCellClassFunc(props.plc)
                if (!!headCellClasses) {
                    classes.push(...toArray(headCellClasses))
                }
            }

            return classes
        })
        const innerCellClass = computed(() => props.plc.classes.head.innerCell)

        /*---------------------------------------col diaggable-------------------------------------------*/

        const colDraggable = computed(() => {
            return !!table.props.colDraggable && props.plc.props.colDraggable !== false
        })

        const {tdBinding} = useColDraggier({
            colDraggable: colDraggable.value,
            plc: () => props.plc,
            table: table,
        })

        return () => {

            const content = [
                <div style={innerCellStyles.value} class={innerCellClass.value}>
                    {/*{props.plc.isLastFixedLeft && 'isLastFixedLeft'}-{props.plc.isFirstFixedRight && 'isFirstFixedRight'}*/}
                    {PlcRender.head(props.plc)}
                </div>,
                <span class="plt-head-cell-indicator" onmousedown={resizeHandler.mousedown}/>
            ]

            if (cellStyles.value.position === 'sticky' && !stickyFlag && !table.props.disabledStickyCompatible) {
                const styles = {...cellStyles.value}
                delete styles.position
                delete styles[props.plc.props.fixed]

                return (
                    <pl-scroll-sticky
                        rowspan={props.plc.rowspan}
                        colspan={props.plc.colspan}
                        key={key.value}
                        class={cellClasses.value}
                        style={styles}
                        {...{
                            props: {
                                tag: 'td',
                                [props.plc.props.fixed]: Number($plain.utils.removePx(cellStyles.value[props.plc.props.fixed])),
                                zIndex: cellStyles.value.zIndex,
                            },
                            ...tdBinding,
                        }}

                    >
                        {content}
                    </pl-scroll-sticky>
                )
            } else {
                return (
                    <td rowspan={props.plc.rowspan}
                        colspan={props.plc.colspan}
                        key={key.value}
                        class={cellClasses.value}
                        style={cellStyles.value}
                        {...tdBinding}
                    >
                        {content}
                    </td>
                )
            }
        }
    },
})