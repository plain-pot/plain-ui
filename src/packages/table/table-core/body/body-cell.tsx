import {designComponent} from "../../../../use/designComponent";
import {computed, PropType} from 'vue';
import {PlcType} from "../../plc-core/plc.type";
import {TableNode} from "../node";
import {PlainTable} from "../../table";
import {getCellClass} from "../../plc-format/classAndStyle";
import {SingleClass} from "../../../../use/useClasses";
import {PlcRender} from "../../plc-format/plcRender";
import {toArray} from "../../../../utils/toArray";
import {stickyFlag} from "../../plc-core/plc.utils";
import {removeUnit} from "plain-utils/string/removeUnit";

export const PltBodyCell = designComponent({
    name: 'plt-body-cell',
    props: {
        plc: {type: Object as PropType<PlcType>, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        table: {type: Object as PropType<PlainTable>, required: true},
    },
    setup({props}) {

        const table = props.table
        const span = !!table.props.spanMethod ? table.props.spanMethod({tableNode: props.node, plc: props.plc}) : {rowspan: 1, colspan: 1,}
        const renderData = computed(() => PlcRender.body({
            plc: props.plc,
            node: props.node,
        }))

        const cellStyles = computed(() => props.plc.styles.body.cell)
        const innerCellStyles = computed(() => {
            let styles = {...props.plc.styles.body.innerCell}
            if (span.rowspan > 1) {
                styles.height = `${table.numberState.bodyRowHeight * span.rowspan}px`
            }
            if (!!table.props.cellStyleFunc) {
                const cellStyles = table.props.cellStyleFunc(props.node, props.plc) || {}
                styles = {
                    ...styles,
                    ...cellStyles
                }
            }
            return styles
        })
        const cellClass = computed(() => {
            const classes = [
                ...props.plc.classes.body.cell,
                ...getCellClass(props.plc, props.node),
                {
                    'plt-cell-editing': renderData.value.editable,
                },
            ] as SingleClass[]

            if (!!table.props.cellClassFunc) {
                const cellClasses = table.props.cellClassFunc(props.node, props.plc)
                if (!!cellClasses) {
                    classes.push(...toArray(cellClasses))
                }
            }

            return classes
        })
        const innerCellClass = computed(() => props.plc.classes.body.innerCell)


        return {
            render: () => {

                if (span.rowspan === 0 || span.colspan === 0) {
                    /*rowspan为0时，不会正确合并单元格，如果要合并单元格得不渲染这个td*/
                    return null
                }

                const content = (
                    <div style={innerCellStyles.value as any} class={innerCellClass.value}>
                        {/*{props.plc.isLastFixedLeft && 'isLastFixedLeft'}-{props.plc.isFirstFixedRight && 'isFirstFixedRight'}*/}
                        {renderData.value.body}
                    </div>
                )

                if (cellStyles.value.position === 'sticky' && !stickyFlag && !table.props.disabledStickyCompatible) {
                    const styles = {...cellStyles.value} as any
                    delete styles.position
                    delete styles[props.plc.props.fixed]

                    return (
                        <pl-scroll-sticky
                            colspan={span.colspan}
                            rowspan={span.rowspan}
                            class={cellClass.value}
                            style={styles}
                            {...{
                                tag: 'td',
                                [props.plc.props.fixed]: Number(removeUnit((cellStyles.value as any)[props.plc.props.fixed]!)),
                                zIndex: cellStyles.value.zIndex,
                            }}>
                            {content}
                        </pl-scroll-sticky>
                    )
                } else {
                    return (
                        <td colspan={span.colspan}
                            rowspan={span.rowspan}
                            class={cellClass.value}
                            style={cellStyles.value as any}>
                            {content}
                        </td>
                    )
                }
            }
        }
    },
})