import {computed, defineComponent} from "@vue/composition-api";
import {injectTable} from "@/packages/table/table/table";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'plt-head',
    setup() {

        const table = injectTable()

        const headPlcList = computed(() => {

            // 最大表头层数
            let maxLevel = 1
            const plcList = table.plcData.value!.plcList

            // 计算最大层数
            const calculateLevel = (list: (PlcType | PlcGroupType)[] | null, level) => {
                if (!!list && list.length > 0) {
                    if (level > maxLevel) maxLevel = level
                    list.forEach((item) => {
                        item.level = level - 1
                        if (item.type === PlcComponentType.GROUP) {
                            calculateLevel((item as PlcGroupType).items.value, level + 1)
                        }
                    })
                }
            }
            calculateLevel(plcList, 1)

            // 计算多级表头每个单元格所占行数以及列数
            const calculateSpan = (item: PlcType | PlcGroupType) => {
                if (item.type === PlcComponentType.GROUP) {
                    const group = item as PlcGroupType
                    group.items.value.forEach(calculateSpan)
                    group.rowspan = 1
                    group.colspan = 0
                    group.items.value.forEach(i => group.colspan! += i.colspan!)
                } else {
                    const plc = item as PlcType
                    plc.rowspan = maxLevel - plc.level!
                    plc.colspan = 1
                }
            }
            plcList.forEach(plc => calculateSpan(plc))

            // 计算结果
            const headCols: (PlcType | PlcGroupType)[][] = []

            for (let j = 0; j < maxLevel; j++) headCols.push([])
            // 收集多级表头渲染数据
            const calculateHeadColumns = (list: (PlcType | PlcGroupType)[]) => {
                if (!!list && list.length > 0) {
                    list.forEach((item) => {
                        headCols[item.level!].push(item)
                        if (item.type === PlcComponentType.GROUP) {
                            calculateHeadColumns((item as PlcGroupType).items.value)
                        }
                    })
                }
            }
            calculateHeadColumns(plcList)

            return headCols
        })

        const styles = computed(() => {
            return {
                width: $plain.utils.suffixPx(table.totalContentWidth.value)
            }
        })

        return () => {
            return (
                <div class="plt-head">
                    <pl-scroll
                        ref="scroll"
                        scrollY={false}
                        scrollX
                        fitContentHeight
                    >
                        <table class="plt-table plt-head-table" style={styles.value}>
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