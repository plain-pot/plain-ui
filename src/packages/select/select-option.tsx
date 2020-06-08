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
    disabled: {type: Boolean},
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
        const isShow = computed(() => !!selectPanel && selectPanel.utils.isShow(props))

        const {slots} = useSlots()

        const classes = computed(() => ([
            'pl-select-option',
            {
                'pl-select-option-selected': isSelected.value,
                'pl-select-option-show': isShow.value,
                'pl-select-option-disabled': props.disabled,
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
                 class={classes.value}
                 onClick={handler.click}>
                {!!selectPanel && isShow.value && [
                    !!selectPanel.props.multiple ? <pl-checkbox readonly value={isSelected.value} class="pl-select-option-checkbox"/> : null
                    ,
                    !!props.icon ? <pl-icon icon={props.icon} class="pl-select-option-icon"/> : null
                    ,
                    slots.default(props.label)
                ].filter(Boolean)}
            </div>
        )
    },
})

export type SelectOptionCtxType = ExtractPropTypes<typeof SelectOptionProps>