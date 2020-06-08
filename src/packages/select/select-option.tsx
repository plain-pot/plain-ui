import {computed, defineComponent, inject} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR} from "@/packages/select/select-utils";
import {useSlots} from "@/use/useSlots";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {SELECT_PANEL_PROVIDER, SelectPanelContextType} from "@/packages/select/select-panel";

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
        const selectPanel = inject(SELECT_PANEL_PROVIDER) as SelectPanelContextType
        const isSelected = computed(() => !!selectPanel && selectPanel.utils.isSelected(props))

        const {slots} = useSlots()

        const classes = computed(() => ([
            'pl-select-option',
            {
                'pl-select-option-selected': isSelected.value,
            }
        ]))

        const handler = {
            click: () => {
                !!selectPanel && selectPanel.handler.clickOption(props)
            }
        }

        return () => (
            <div label={props.label}
                 val={props.val}
                 icon={props.icon}
                 disabled={props.disabled}
                 class={classes.value}
                 onClick={handler.click}>
                {!!selectPanel && [
                    !!selectPanel.props.multiple ? <pl-checkbox readonly value={isSelected.value} class="pl-select-option-checkbox"/> : null
                    ,
                    slots.default(props.label)
                ].filter(Boolean)}
            </div>
        )
    },
})

export type SelectOptionCtxType = ExtractPropTypes<typeof SelectOptionProps>