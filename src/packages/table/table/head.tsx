import {computed, defineComponent, inject, onBeforeUnmount, provide} from "@vue/composition-api";
import {TABLE_PROVIDER, TableHoverPart} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {useRefs} from "@/use/useRefs";
import {PlainScroll} from "@/packages/scroll/scroll";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

export const PLT_HEAD_PROVIDER = '@@PLT_HEAD_PROVIDER'

function headSetup() {

    const refs = useRefs({
        scroll: {} as PlainScroll,
    })
    const table = inject(TABLE_PROVIDER) as PlainTable

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

    const has = computed(() => {
        return {
            fixedLeft: table.plcData.value!.hasFixedLeft,
            fixedRight: table.plcData.value!.hasFixedLeft,
        }
    })

    const styles = computed(() => ({
        height: `${table.propsState.headRowHeight * headPlcList.value.length}px`
    }))

    const classes = computed(() => ([
        'plt-head',
        {
            'plt-head-border': !!table.props.border || (!!headPlcList.value && headPlcList.value.length > 1)
        }
    ]))

    const handler = {
        scrollLeft: (e: Event, part: TableHoverPart) => {
            if (part === TableHoverPart.body && table.state.hoverState.part === TableHoverPart.body) {
                // console.log('scroll left', TableHoverPart.head)
                refs.scroll.methods.scroll({x: (e.target as HTMLElement).scrollLeft})
            }
        },
        scroll: (e) => {
            table.emit.scrollLeft(e, TableHoverPart.head)
        },
        mousewheel: (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()
            refs.scroll.methods.scrollLeft(refs.scroll.state.wrapperScrollLeft + (e.deltaX || e.deltaY))
        }
    }

    const methods = {
        refershScroll: () => {
            refs.scroll.methods.refresh()
        }
    }

    const refer = {
        refs,
        headPlcList,
        has,
        handler,
        methods,
    }

    provide(PLT_HEAD_PROVIDER, refer)

    table.on.scrollLeft(handler.scrollLeft)

    onBeforeUnmount(() => table.off.scrollLeft(handler.scrollLeft))

    return {
        refs,
        headPlcList,
        styles,
        classes,
        handler,
        methods,
        has,
    }
}

export type PltHeadType = ReturnType<typeof headSetup>

export default defineComponent({
    name: 'plt-head',
    setup() {

        const {
            styles,
            classes,
            handler,
            has,
        } = headSetup()

        return () => (
            <div style={styles.value} class={classes.value} onMousewheel={handler.mousewheel}>
                <pl-scroll scrollX scrollY={false} ref="scroll" onScroll={handler.scroll}>
                    <plt-head-item/>
                </pl-scroll>
                {has.value.fixedLeft && <plt-head-item fixed="left"/>}
                {has.value.fixedRight && <plt-head-item fixed="right"/>}
            </div>
        )
    },
})