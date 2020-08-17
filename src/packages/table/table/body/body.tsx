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
                part !== TableHoverPart.body && refs.virtualTable.$refs.scroll.methods.scrollLeft(scrollLeft)
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
                                    /*
                                    - 这里用 item.key 作为key，感觉虚拟滚动的性能要更好一点
                                    - 树列里面，如果不用这个key的话，复选框会有短暂的切换动画，在展开收起的时候
                                    */
                                    <plt-row key={item.key} vid={index} rowData={item} isSummary={isSummary}/>,
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