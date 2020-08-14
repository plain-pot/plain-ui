import {computed, defineComponent} from "@vue/composition-api";
import {injectTable} from "@/packages/table/table/table";
import {PlainScroll} from "@/packages/scroll/scroll";
import {useRefs} from "@/use/useRefs";
import {TableHoverPart} from "@/packages/table/table-utils";

export default defineComponent({
    name: 'plt-body',
    setup() {

        const refs = useRefs({
            virtualTable: {} as { $refs: { scroll: PlainScroll } }
        })

        const table = injectTable()

        const styles = computed(() => ({
            height: `${table.propsState.bodyRowHeight as number * table.props.showRows + 12}px`
        }))

        const {handler} = table.utils.bindScroll(
            TableHoverPart.body,
            (scrollLeft, part) => {
                part === TableHoverPart.head && refs.virtualTable.$refs.scroll.methods.scrollLeft(scrollLeft)
            }
        )

        return () => (
            <div class="plt-body" style={styles.value}
                 onMouseenter={handler.mouseenter}>
                <pl-virtual-table
                    key={table.props.virtual ? 'enable' : 'disabled'}
                    ref="virtualTable"
                    width={table.totalContentWidth.value}
                    data={table.formatFlatTableData.value}
                    summaryData={table.tableSummaryData.value}
                    size={table.props.bodyRowHeight}
                    disabled={table.isDisabledVirtualScroll.value}
                    scrollProps={{scrollbarSize: 6}}
                    onScroll={handler.scroll}
                    {
                        ...{
                            scopedSlots: {
                                default: ({item, index, isSummary}) => [
                                    <plt-row key={index} vid={index} rowData={item} isSummary={isSummary}/>,
                                    table.plcData.value!.plcListHasRenderAfterRow.length === 0
                                        ? null :
                                        [...table.plcData.value!.plcListHasRenderAfterRow.map(plc => plc.props.renderAfterRow!({
                                            plc,
                                            index,
                                            rowData: item,
                                            isSummary,
                                        }))]
                                ].filter(Boolean)
                            }
                        }
                    }
                />
            </div>
        )
    },
})