import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useClass} from "../../use/useClasses";
import {SelectPanelCollector} from "./select-panel";
import {useRefs} from "../../use/useRefs";
import {computed} from 'vue';
import {SelectGroupCollector} from "./select-group";
import {SelectCollector} from "./select";

export const PlSelectOption = designComponent({
    name: 'pl-select-option',
    props: {
        label: {type: [String, Number], required: true},
        val: {type: [String, Number], required: true},
        icon: {type: String},
        disabled: {type: Boolean},

        group: {type: Boolean},
    },
    setup({props}) {

        const {slots} = useSlots()
        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        SelectCollector.child({injectDefaultValue: null, sort: () => refs.el})
        const group = SelectGroupCollector.child({injectDefaultValue: null})
        const panel = SelectPanelCollector.child({injectDefaultValue: null, sort: () => refs.el})
        const isShow = computed(() => (props.group || !panel || panel.utils.isShow(props)))
        const isSelected = computed(() => !!panel && panel.utils.isSelected(props))

        const refer = {
            props,
            refs,
        }

        const classes = useClass(() => [
            'pl-select-option',
            {
                'pl-select-option-disabled': props.disabled,
                'pl-select-option-show': isShow.value,
                'pl-select-option-selected': isSelected.value,
                'pl-select-option-highlight': !!panel && !!panel.current.value && panel.current.value.props === props,
                'pl-select-option-group-child': !!group && !props.group,
            }
        ])

        const handler = {
            click: () => {
                if (props.group) return
                !!panel && panel.handler.clickOption(refer)
            }
        }

        return {
            refer,
            render: () => {
                return (
                    <div
                        {...{
                            ref: "el",
                            label: props.label,
                            val: props.val,
                            icon: props.icon,
                            class: classes.value,
                            onClick: handler.click,
                        }}>
                        {!!panel && isShow.value && <>
                            {!!panel.props.multiple && !props.group ? <pl-checkbox customReadonly modelValue={isSelected.value} class="pl-select-option-checkbox"/> : null}
                            {!!props.icon && <pl-icon icon={props.icon} class="pl-select-option-icon"/>}
                            {slots.default(props.label)}
                        </>}
                    </div>
                )
            }
        }
    },
})

export type SelectOption = typeof PlSelectOption.use.class