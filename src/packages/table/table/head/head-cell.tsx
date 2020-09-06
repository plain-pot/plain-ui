import {computed, defineComponent} from "@vue/composition-api";
import {PlcType} from "@/packages/table/plc/plc";
import {injectTable} from "@/packages/table/table/table";
import {PlcRender} from "@/packages/table/table/render";
import {useHeadCellResize} from "@/packages/table/table/head/useHeadCellResize";
import {useColDraggier} from "@/packages/table/table/head/useColDraggier";

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
        const cellClasses = computed(() => props.plc.classes.head.cell)
        const innerCellClass = computed(() => props.plc.classes.head.innerCell)

        /*---------------------------------------col diaggable-------------------------------------------*/

        const colDraggable = computed(() => {
            return !!table.props.colDraggable && props.plc.props.colDraggable !== false
        })

        const {tdBinding} = useColDraggier({
            colDraggable: colDraggable.value,
        })

        return () => {
            return (
                <td rowspan={props.plc.rowspan}
                    colspan={props.plc.colspan}
                    key={key.value}
                    class={cellClasses.value}
                    style={cellStyles.value}
                >
                    <div style={innerCellStyles.value} class={innerCellClass.value} {...tdBinding}>
                        {/*{props.plc.isLastFixedLeft && 'isLastFixedLeft'}-{props.plc.isFirstFixedRight && 'isFirstFixedRight'}*/}
                        {PlcRender.head(props.plc)}
                    </div>
                    <span class="plt-head-cell-indicator" onMousedown={resizeHandler.mousedown}/>
                </td>
            )
        }
    },
})