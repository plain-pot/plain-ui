import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";
import './table.scss'
import {TableHoverPart, TableProps} from './core/table.utils';
import {usePlcList} from "./plc/format/usePlcList";
import {computed, onMounted, PropType} from 'vue';
import {SimpleObject} from "../../shims";
import {useBindScroll} from "./core/useBindScroll";
import {TableNode, useTableNode} from "./core/useTableNode";
import {useRefs} from "../../use/useRefs";
import {PlainScroll} from "../scroll/scroll";
import {useFixedShadow} from "./core/useFixedShadow";
import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";
import {useTableCurrent} from "./core/useTableCurrent";

const Table = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    emits: {
        onUpdateData: (data?: SimpleObject[]) => true,
        onScrollLeft: (scrollLeft: number, part: TableHoverPart) => true,
        onVirtualMounted: (data: { scroll: PlainScroll }) => true,

        onClickRow: (node: TableNode, e: MouseEvent) => true,
        onDblclickRow: (node: TableNode, e: MouseEvent) => true,
        onClickCell: (node: TableNode, e: MouseEvent) => true,
        onDblclickCell: (node: TableNode, e: MouseEvent) => true,
    },
    setup({props, event}) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        const {styleComputed} = useStyle({shape: StyleShape.square, size: StyleSize.normal, status: undefined})
        const {emit} = event
        const {slots} = useSlots()
        const {numberState, plcData} = usePlcList({props})
        const {bindScroll} = useBindScroll(event)
        const {nodeState} = useTableNode({props, emit, getValidate: () => null as any})
        const {fixedShadowClass} = useFixedShadow(event)
        const tableCurrent = useTableCurrent({nodeState, emit: event.emit})

        /*是否可以启用虚拟滚动*/
        const disabledVirtual = computed(() => props.virtual == false || (!!plcData.value && plcData.value.notFitVirtual.length > 0))

        const classes = computed(() => [
            'pl-table',
            `pl-table-size-${styleComputed.value.size}`,
            `pl-table-shape-${styleComputed.value.shape}`,
            {
                'pl-table-border': props.border,
            },
            ...fixedShadowClass.value,
        ])

        const methods = {
            ...tableCurrent.methods,
        }

        const refer = {
            refs,
            props,
            numberState,
            plcData,
            bindScroll,
            event,
            nodeState,
            disabledVirtual,
            tableCurrent,
            ...methods,
        }

        onMounted(() => {
            // console.log(refer.nodeState)
        })

        return {
            refer,
            render: () => (
                <div class={classes.value} ref="el">
                    <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    {!!plcData.value && <>
                        <PltHead table={refer}/>
                        <PltBody table={refer}/>
                    </>}
                </div>
            )
        }
    },
})

export const PlainTable = Object as PropType<typeof Table.use.class>

export default Table