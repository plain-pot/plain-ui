import {computed, designComponent, onMounted, PropType, reactive, useClasses, useRefs, watch} from "plain-design-composition";
import {TableDefaultRowHeight, TableHoverPart, TableProps} from "./table/utils/table.utils";
import {useTree} from "../PlTree/core/useTree";
import {TableNode, useTableNode} from "./table/use/useTableNode";
import {PlainScroll} from "../PlScroll";

import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";
import {usePlcList} from "./plc/format/usePlcList";
import {useBindScroll} from "./table/use/useBindScroll";
import {useFixedShadow} from "./table/use/useFixedShadow";
import {hasClass} from "plain-utils/dom/hasClass";
import {PltHead} from "./table/head/head";
import {PltBody} from "./table/body/body";
import {PlLoadingMask} from "../PlLoadingMask";
import {getFormRuleData} from "../PlForm/form.validate";
import {useTableHooks} from "./table/use/useTableHooks";
import {removeUnit} from "plain-utils/string/removeUnit";
import {getPropsState, tPlcCacheStateData} from "./plc/utils/usePropsState";
import {tPlcType} from "./plc/utils/plc.type";
import {tPlcData} from "./plc/format/formatPlcList";
import {PlEmpty} from "../PlEmpty";

export const PlTable = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps
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
        onClickHead: (plc: tPlcType, e: MouseEvent) => true,

        onConfigPlc: (data: { plcList: tPlcType[], stateData: tPlcCacheStateData }) => true,
        onCollectPlcData: (plcData: tPlcData) => true,
    },
    slots: ['default'],
    setup({props, slots, event}) {

        const {emit} = event
        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const hooks = useTableHooks()
        const {plcData, renderCollector} = usePlcList({props, hooks, slots, onCollectPlcData: event.emit.onCollectPlcData})
        const {bindScroll} = useBindScroll(event)
        const {state, flatNodes, summaryNodes, dataModel, methods, current, handler, utils} = useTableNode({props, emit, getValidate: () => formValidate.value})
        const {fixedShadowClass} = useFixedShadow(event)

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })
        const {numberState} = (() => {
            const watchValue = computed(() => {
                const {bodyRowHeight: propsBodyRowHeight, headRowHeight: propsHeadRowHeight,} = props
                let {size} = styleComputed.value
                if (!size) {size = StyleSize.normal}
                const bodyRowHeight = Number(propsBodyRowHeight == null ? removeUnit(TableDefaultRowHeight.body[size]) : propsBodyRowHeight)
                const headRowHeight = Number(propsHeadRowHeight == null ? removeUnit(TableDefaultRowHeight.head[size]) : propsHeadRowHeight)
                return {bodyRowHeight, headRowHeight}
            })
            const numberState = reactive({...watchValue.value,})
            watch(watchValue, () => Object.assign(numberState, watchValue.value))
            return {numberState}
        })();

        const formValidate = computed(() => getFormRuleData({
            formProps: {rules: props.rules},
            formItems: {
                value: !plcData.value ? [] : plcData.value.sourceFlatPlcList.map(plc => ({
                    props: {
                        label: plc.props.title,
                        field: plc.props.field,
                        required: plc.props.required,
                        rules: plc.props.rules,
                    }
                }))
            },
            // todo
            requiredMessage: '必填',
        }))

        /*是否可以启用虚拟滚动*/
        const disabledVirtual = computed(() => {
            if (props.virtual === false) {return true}
            /*如果有的列不能启动虚拟滚动，那么会增加一个hook拦截器，hooks.onDisabledVirtual.exec会返回true*/
            return hooks.onDisabledVirtual.exec(false)
        })

        const classes = useClasses(() => [
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

        const emitConfigPlc = () => {
            hooks.onConfigPlc.exec({plcList: plcData.value!.sourceList, stateData: getPropsState(plcData.value!.sourceList)})
        }

        const refer = {
            refs,
            onRef,
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
            hooks,
            slots,
            emitConfigPlc,
        }

        onMounted(() => {
            hooks.onTableMounted.exec(refs.el!)
            hooks.onConfigPlc.use(data => event.emit.onConfigPlc(data))
        })

        return {
            refer,
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {renderCollector()}
                    {!!plcData.value && <>
                        {!props.hideHeader && <PltHead table={refer}/>}
                        <PltBody table={refer}/>
                    </>}
                    {refer.flatNodes.value.length === 0 && refer.plcData.value && (
                        <div class="pl-table-no-data">
                            <PlEmpty/>
                        </div>
                    )}
                    <PlLoadingMask modelValue={props.loading || state.root.loading}/>
                </div>
            )
        }
    },
})

export default PlTable

export const PlainTable = Object as PropType<typeof PlTable.use.class>

export type tPlTable = typeof PlTable.use.class

export function injectPlainTable() {return PlTable.use.inject()}
