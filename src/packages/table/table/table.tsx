import {computed, defineComponent, onMounted, Ref} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

export const TableProps = {}

function tableSetup(props: ExtractPropTypes<typeof TableProps>) {

}

export default defineComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup(props) {

        const {slots} = useSlots()
        const refs = useRefs({
            collector: CompRef,
        })

        const classes = computed(() => [
            'pl-table',
        ])

        onMounted(() => {
            const items = refs.collector.items as Ref<(PlcType | PlcGroupType)[]>
            console.log(items.value)
            items.value.forEach(item => {
                if (item.type === PlcComponentType.PLC) {
                    console.log('plc', item.props.title, (item as PlcType).props.field)
                } else {
                    console.log('group', item.props.title, (item as PlcGroupType).props)
                }
            })
        })

        return () => (
            <div class={classes.value}>
                <plc-collector ref="collector">{slots.default()}</plc-collector>

            </div>
        )
    },
})