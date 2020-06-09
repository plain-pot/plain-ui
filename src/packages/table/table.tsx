import {computed, defineComponent} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useSlots} from "@/use/useSlots";

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

        const classes = computed(() => [
            'pl-table',
        ])

        return () => (
            <div class={classes.value}>
                {slots.default()}
            </div>
        )
    },
})