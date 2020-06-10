import {computed, defineComponent, provide} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableProps} from "@/packages/table/table-utils";
import {useMounted} from "@/use/useMounted";
import {printPlcData} from "@/packages/table/plc/debug";
import {handlePlcConfigAndState} from "@/packages/table/plc/plc-utils";


function tableSetup(props: ExtractPropTypes<typeof TableProps>) {

    const {slots} = useSlots()
    const isMounted = useMounted()

    const refs = useRefs({
        collector: CompRef,
    })

    const plcData = computed(() => {
        if (!isMounted.value) return []
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        items = handlePlcConfigAndState(items, props.config)

        console.log(items)

        return items
    });

    const refer = {
        props,

        slots,
        refs,
        plcData,
    }

    provide(TABLE_PROVIDER, refer)

    // onMounted(() => console.log(plcData.value))

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
        } = tableSetup(props)

        const classes = computed(() => [
            'pl-table',
        ])

        return () => {

            return (
                <div class={classes.value}>
                    <plc-collector ref="collector">{slots.default()}</plc-collector>

                    {!!props.debugPlc && printPlcData(plcData.value)}
                </div>
            )
        }
    },
})