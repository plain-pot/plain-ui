import {defineComponent, inject} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-utils";
import {useSlots} from "@/use/useSlots";
import {I_AM_SELECT_PANEL} from "@/packages/select/select-panel";

export default defineComponent({
    name: 'pl-select-option',
    props: {
        label: {type: String},
        val: {type: String},
        icon: {type: String},
        disabled: {type: String},
    },
    setup(props) {

        useCollectChild({provideString: SELECT_PANEL_PROVIDER})
        const underPanelFlag = inject(I_AM_SELECT_PANEL)

        const {slots} = useSlots()

        return () => (
            <div label={props.label} val={props.val} icon={props.icon} disabled={props.disabled} class="pl-select-option">
                {!!underPanelFlag && slots.default(props.label)}
            </div>
        )
    },
})