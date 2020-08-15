import {computed, defineComponent, watch} from "@vue/composition-api";
import {injectTable} from "@/packages/table/table/table";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";
import {$plain} from "@/packages/base";
import {TableHoverPart} from "@/packages/table/table-utils";
import {useRefs} from "@/use/useRefs";
import {PlainScroll} from "@/packages/scroll/scroll";

export default defineComponent({
    name: 'plt-head',
    setup() {

        const refs = useRefs({
            scroll: {} as PlainScroll
        })

        const table = injectTable()

        const headPlcList = computed(() => table.plcData.value!.headCols)

        const tableStyles = computed(() => {
            return {
                width: $plain.utils.suffixPx(table.totalContentWidth.value),
            }
        })

        const {handler} = table.utils.bindScroll(
            TableHoverPart.head,
            (scrollLeft, part) => {
                part !== TableHoverPart.head && refs.scroll.methods.scrollLeft(scrollLeft)
            }
        )

        const styles = computed(() => ({
            height: `${table.propsState.headRowHeight * headPlcList.value.length}px`,
        }))

        watch(() => styles.value, () => !!refs.scroll && $plain.nextTick(refs.scroll.methods.refresh))

        return () => {
            return (
                <div class="plt-head"
                     onMouseenter={handler.mouseenter}
                     onMousewheel={e => table.handler.headMousewheel(e, refs.scroll)}
                     style={styles.value}>
                    {/*这里不能加 scrollY={false}，会导致sticky固定失效*/}
                    <pl-scroll
                        ref="scroll"
                        scrollX
                        fitContentHeight
                        hideScrollbar
                        onScroll={handler.scroll}
                    >
                        <table class="plt-table plt-head-table" style={tableStyles.value}>
                            <thead>
                            {headPlcList.value.map((row, rowIndex) => (
                                <tr row={rowIndex}>
                                    {row.map((cell, cellIndex) => <plt-head-cell key={cellIndex} plc={cell}/>)}
                                </tr>
                            ))}
                            </thead>
                        </table>
                    </pl-scroll>
                </div>
            )
        }
    },
})