import {computed, defineComponent, onMounted, provide, Ref} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableProps} from "@/packages/table/table-utils";
import {getReturnType} from "@/util/util";
import {useMounted} from "@/use/useMounted";


function tableSetup(props: ExtractPropTypes<typeof TableProps>) {

    const {slots} = useSlots()
    const isMounted = useMounted()

    const refs = useRefs({
        collector: CompRef,
    })

    const plcData = computed(() => {
        if (!isMounted.value) return []
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        return items
    });

    const refer = {
        slots,
        refs,
        props,
        plcData,
    }

    provide(TABLE_PROVIDER, refer)

    // onMounted(() => console.log(plcData.value))

    return refer
}

const TableSetupValue = getReturnType(tableSetup)
export type PlainTable = typeof TableSetupValue

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

        return () => (
            <div class={classes.value}>
                <plc-collector ref="collector">{slots.default()}</plc-collector>
                {
                    plcData.value.map(item => (
                        <div>{item.props.title}-{(item as PlcType).props.field}-{(item as PlcType).props.width}</div>
                    ))
                }
            </div>
        )
    },
})