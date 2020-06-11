import {computed, defineComponent, onMounted, provide, reactive} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableHoverPart, TableProps} from "@/packages/table/table-utils";
import {printPlcData} from "@/packages/table/plc/debug";
import {handlePlcConfigAndState, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useEvent} from "@/use/useEvent";


function tableSetup(props: ExtractPropTypes<typeof TableProps>) {

    const {emit, on, off} = useEvent({
        scrollLeft: (e: Event, part: TableHoverPart) => {},
    })

    const {slots} = useSlots()

    const refs = useRefs({
        collector: CompRef,
    })

    /*---------------------------------------state-------------------------------------------*/

    const state = reactive({
        tableWidth: null as null | number,
        hoverState: {
            part: TableHoverPart.body,
            fixed: PlcFixedType.center,
        },
    })

    const propsState = useProps(props, {
        headRowHeight: FormatPropsType.number,
        bodyRowHeight: FormatPropsType.number,
    })

    /*---------------------------------------computer-------------------------------------------*/

    const plcData = computed(() => {
        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        return handlePlcConfigAndState(items, props.config, state.tableWidth)
    });

    const bodyPlcList = computed(() => {
        if (!state.tableWidth) return null
        return plcData.value!.flatPlcList
    })

    const totalContentWidth = computed(() => {
        if (!bodyPlcList.value) return
        return bodyPlcList.value.reduce((ret, plc) => {
            return ret + (plc.props.width as number)
        }, 0)
    })

    const tableData = computed(() => {
        return (props.data || []).map((row, rowIndex) => ({
            row,
            rowIndex,
        }))
    })

    const tableSummaryData = computed(() => {
        return (props.summaryData || []).map((row, rowIndex) => ({
            row,
            rowIndex,
        }))
    })

    const isDisabledVirtualScroll = computed(() => {
        return !props.virtual
    })

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        hoverPart: (part: TableHoverPart, fixed: PlcFixedType) => {
            state.hoverState.part = part
            state.hoverState.fixed = fixed
        }
    }

    const refer = {
        props,
        slots,
        refs,

        plcData,
        bodyPlcList,
        totalContentWidth,
        tableData,
        tableSummaryData,
        isDisabledVirtualScroll,

        state,
        propsState,

        emit,
        on,
        off,

        handler,
    }

    provide(TABLE_PROVIDER, refer)

    onMounted(() => state.tableWidth = refs.$el.offsetWidth)

    return refer
}

export type PlainTable = ReturnType<typeof tableSetup>

export default defineComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup(props) {

        const {
            slots,
            refs,
            plcData,
            state,
        } = tableSetup(props)

        const classes = computed(() => [
            'pl-table', {
                'pl-table-border': props.border,
                'pl-table-disabled-high-current': props.disabledHighCurrentRow,
            }
        ])

        return () => {

            return (
                <div class={classes.value}>
                    <plc-collector ref="collector">{slots.default()}</plc-collector>
                    {!!state.tableWidth && [
                        <plt-head ref="head"/>,
                        <plt-body ref="body"/>,
                    ]}
                    {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
                </div>
            )
        }
    },
})