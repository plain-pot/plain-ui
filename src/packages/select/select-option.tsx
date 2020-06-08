import {defineComponent, inject} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR} from "@/packages/select/select-utils";
import {useSlots} from "@/use/useSlots";
import {I_AM_SELECT_PANEL} from "@/packages/select/select-panel";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";

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
        const underPanelFlag = inject(I_AM_SELECT_PANEL)

        const {slots} = useSlots()

        return () => (
            <div label={props.label} val={props.val} icon={props.icon} disabled={props.disabled} class="pl-select-option">
                {!!underPanelFlag && slots.default(props.label)}
            </div>
        )
    },
})

export type SelectOptionCtxType = ExtractPropTypes<typeof SelectOptionProps>