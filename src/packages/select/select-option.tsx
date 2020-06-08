import {defineComponent, inject} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR} from "@/packages/select/select-utils";
import {useSlots} from "@/use/useSlots";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-panel";

const SelectOptionProps = {
    label: {type: String},
    val: {type: String},
    icon: {type: String},
    disabled: {type: String},
}

export default defineComponent({
    name: 'pl-select-option',
    props: {
        ...SelectOptionProps,
    },
    setup(props) {

        useCollectChild({provideString: SELECT_PANEL_COLLECTOR})
        const selectPanel = inject(SELECT_PANEL_PROVIDER)

        const {slots} = useSlots()

        return () => (
            <div label={props.label} val={props.val} icon={props.icon} disabled={props.disabled} class="pl-select-option">
                {!!selectPanel && slots.default(props.label)}
            </div>
        )
    },
})

export type SelectOptionCtxType = ExtractPropTypes<typeof SelectOptionProps>