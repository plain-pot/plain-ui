import {computed, defineComponent, onMounted} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";

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
            console.log(refs.collector.items.value)
        })

        return () => (
            <div class={classes.value}>
                <plc-collector ref="collector">{slots.default()}</plc-collector>

            </div>
        )
    },
})