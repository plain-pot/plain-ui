import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";
import './table.scss'
import {TableHoverPart, TableProps} from './core/table.utils';
import {usePlcList} from "./plc/format/usePlcList";
import {computed, ComputedRef, inject, onMounted, PropType} from 'vue';
import {useBindScroll} from "./core/useBindScroll";
import {TableNode, useTableNode} from "./core/useTableNode";
import {useRefs} from "../../use/useRefs";
import {PlainScroll} from "../scroll/scroll";
import {useFixedShadow} from "./core/useFixedShadow";
import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";
import {formatFormRules, FormValidate} from "../form/form.validate";
import {useTree} from "../tree/core/useTree";
import {hasClass} from "plain-utils/dom/hasClass";

export const PlTable = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    provideRefer: true,
    emits: {
        ...useTree.createEvent<TableNode>(),
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

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape || StyleShape.square
                config.size = props.size || StyleSize.normal
                config.status = props.status
            }
        })
        const {emit} = event
        const {slots} = useSlots()
        const {numberState, plcData} = usePlcList({props})
        const {bindScroll} = useBindScroll(event)
        const {state, flatNodes, summaryNodes, dataModel, methods, current, handler, utils} = useTableNode({props, emit, getValidate: () => formValidate.value})
        const {fixedShadowClass} = useFixedShadow(event)
        const formValidate = computed(() => formatFormRules(
            props.rules,
            !plcData.value ? undefined : plcData.value.flatPlcList.map(plc => ({
                label: plc.props.title,
                field: plc.props.field,
                required: plc.props.required,
                rules: plc.props.rules,
            })))) as ComputedRef<FormValidate>

        /*是否可以启用虚拟滚动*/
        const disabledVirtual = computed(() => props.virtual == false || (!!plcData.value && plcData.value.notFitVirtual.length > 0))

        const classes = computed(() => [
            'pl-table',
            `pl-table-size-${styleComputed.value.size}`,
            `pl-table-shape-${styleComputed.value.shape}`,
            {
                'pl-table-border': props.border,
                'pl-table-stripe': props.stripe,
            },
            ...fixedShadowClass.value,
        ])

        const exposeHandler = {
            ...handler,
            onClickRow: (e: MouseEvent, node: TableNode) => {
                methods.setCurrent(node.key);
                emit.onClickRow(node, e);
                hasClass(e.target as HTMLElement, 'plt-cell') && emit.onClickCell(node, e);
            },
            onDblclickRow: (e: MouseEvent, node: TableNode) => {
                emit.onDblclickRow(node, e)
                hasClass(e.target as HTMLElement, 'plt-cell') && emit.onDblclickCell(node, e);
            }
        }

        const refer = {
            refs,
            props,
            numberState,
            plcData,
            bindScroll,
            event,
            dataModel,
            state, flatNodes, summaryNodes,
            disabledVirtual,
            handler: exposeHandler,
            ...methods,
            formValidate,
            current,
            utils,
        }

        onMounted(() => {
            // console.log(refer.nodeState)
        })

        return {
            refer,
            render: () => (
                <div class={classes.value} ref="el" v-loading={props.loading || state.root.loading}>
                    <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    {!!plcData.value && <>
                        {!props.hideHeader && <PltHead table={refer}/>}
                        <PltBody table={refer}/>
                    </>}
                </div>
            )
        }
    },
})

export const PlainTable = Object as PropType<typeof PlTable.use.class>

export function injectPlainTable() {return inject('@@pl-table') as typeof PlTable.use.class}