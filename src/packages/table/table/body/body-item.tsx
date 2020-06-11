import {computed, defineComponent, inject, onBeforeUnmount} from "@vue/composition-api";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useRefs} from "@/use/useRefs";
import {PlainVirtualTable} from "@/packages/table/component/virtual-table";
import {useRefer} from "@/use/useRefer";
import {PLAIN_TABLE_BODY_PROVIDER, PlainTableBody} from "@/packages/table/table/body/body";
import {TABLE_PROVIDER, TableHoverPart} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {useEvent} from "@/use/useEvent";

const Props = {
    fixed: {type: String, default: PlcFixedType.center},
}

function setup(props: ExtractPropTypes<typeof Props>) {

    /*---------------------------------------inject-------------------------------------------*/

    const table = inject(TABLE_PROVIDER) as PlainTable
    const body = inject(PLAIN_TABLE_BODY_PROVIDER) as PlainTableBody

    const {emit} = useEvent({
        scroll: (e: Event, fixed: PlcFixedType) => {}
    })

    const refs = useRefs({
        virtualTable: {} as PlainVirtualTable,
    })

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        on: props.fixed === PlcFixedType.center ? {
            mousewheel: (e: MouseWheelEvent) => {
                if (e.altKey) {
                    e.preventDefault()
                    e.stopPropagation()
                    refs.virtualTable.refs.scroll.methods.scrollLeft(refs.virtualTable.refs.scroll.state.wrapperScrollLeft + (e.deltaX || e.deltaY))
                }
            },
        } : {},
        scroll: (e) => emit.scroll(e, props.fixed as PlcFixedType),
        mouseenter: () => table.handler.hoverPart(TableHoverPart.body, props.fixed as PlcFixedType)
    }

    /*---------------------------------------computed-------------------------------------------*/

    const classes = computed(() => [
        'plt-body-item',
        `pl-table-item-fixed-${props.fixed}`
    ])

    const width = computed(() => {
        if (!table.totalContentWidth.value) return
        const flatPlcList = table.bodyPlcList.value!
        let totalWidth = 0
        flatPlcList.forEach(plc => {
            if (plc.props.fixed === props.fixed || props.fixed === PlcFixedType.center) {
                totalWidth += plc.props.width as number
            }
        })
        return totalWidth
    })

    const styles = computed(() => {
        if (props.fixed === PlcFixedType.center) {
            return null
        } else {
            return {
                width: `${width.value}px`
            }
        }
    })

    const scrollProps = computed(() => ({
        hideScrollbar: props.fixed === PlcFixedType.left,
        scrollX: props.fixed === PlcFixedType.center,
        scrollbarSize: 6,
    }))

    const refer = {
        props,
        refs,
        handler,
        classes,
        width,
        styles,
        scrollProps,
        table,
    }

    useRefer(refer)
    body.state.bodyItems[props.fixed] = {refs, props}
    onBeforeUnmount(() => body.state.bodyItems[props.fixed] = null)

    return refer
}

export type PlainTableBodyItem = ReturnType<typeof setup>

export default defineComponent({
    name: 'plt-body-item',
    props: {
        ...Props,
    },
    setup: (props) => {
        const {
            handler,
            classes,
            width,
            styles,
            scrollProps,
            table,
        } = setup(props)

        return () => {

            return (
                <div class={classes.value} style={styles.value} onMouseenter={handler.mouseenter} {...{on: handler.on}}>
                    <pl-virtual-table
                        ref="virtualTable"
                        width={width.value}
                        data={table.tableData.value}
                        summaryData={table.tableSummaryData.value}
                        size={table.props.bodyRowHeight}
                        disabled={table.isDisabledVirtualScroll.value}
                        scrollProps={scrollProps.value}
                        onScroll={handler.scroll}
                        {
                            ...{
                                scopedSlots: {
                                    default: ({item, index}) => (
                                        <plt-row key={index} vid={index} rowData={item} fixed={props.fixed}/>
                                    )
                                }
                            }
                        }
                    />
                </div>
            )
        }
    }
})