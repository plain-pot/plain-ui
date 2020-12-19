import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";
import './table.scss'
import {TableHoverPart, TableProps} from './core/table.utils';
import {usePlc} from "./plc/format/usePlc";
import {computed, onMounted, PropType} from 'vue';
import {SimpleObject} from "../../shims";
import {useBindScroll} from "./core/useBindScroll";
import {useTableNode} from "./core/useTableNode";
import {useRefs} from "../../use/useRefs";
import {PlainScroll} from "../scroll/scroll";
import {useFixedShadow} from "./core/useFixedShadow";
import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";

const Table = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    emits: {
        onUpdateData: (data?: SimpleObject[]) => true,
        onScrollLeft: (scrollLeft: number, part: TableHoverPart) => true,
        onVirtualMounted: (data: { scroll: PlainScroll }) => true,
    },
    setup({props, event}) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        const {styleComputed} = useStyle({shape: StyleShape.square, size: StyleSize.normal, status: undefined})
        const {emit} = event
        const {slots} = useSlots()
        const {numberState, plcData} = usePlc({props})
        const {bindScroll} = useBindScroll(event)
        const {nodeState} = useTableNode({props, emit, getValidate: () => null as any})
        const {fixedShadowClass} = useFixedShadow(event)

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

        const refer = {
            refs,
            props,
            numberState,
            plcData,
            bindScroll,
            event,
            nodeState,
            disabledVirtual,
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