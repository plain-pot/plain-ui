import {computed, defineComponent, onMounted, provide, reactive} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableProps} from "@/packages/table/table-utils";
import {printPlcData} from "@/packages/table/plc/debug";
import {handlePlcConfigAndState} from "@/packages/table/plc/plc-utils";


function tableSetup(props: ExtractPropTypes<typeof TableProps>) {

    const {slots} = useSlots()

    const refs = useRefs({
        collector: CompRef,
    })

    const state = reactive({
        tableWidth: null as null | number,
    })

    const plcData = computed(() => {
        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        return handlePlcConfigAndState(items, props.config, state.tableWidth)
    });

    const refer = {
        props,
        slots,
        refs,
        plcData,
        state,

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
            'pl-table',
        ])

        return () => {

            return (
                <div class={classes.value}>
                    <plc-collector ref="collector">{slots.default()}</plc-collector>
                    {!!state.tableWidth && [
                        <plt-head ref="head"/>,
                    ]}
                    {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
                </div>
            )
        }
    },
})