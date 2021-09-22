import {computed, designComponent, useRefs} from "plain-ui-composition";
import {SelectGroupCollector} from "../PlSelectGroup";
import {useClasses} from "plain-ui-composition";

import {PlCheckbox} from "../PlCheckbox";
import PlIcon from "../PlIcon";
import {SelectPanelCollector} from "../PlSelect/PlSelectPanel";
import {SelectCollector} from "../PlSelect";

export const PlSelectOption = designComponent({
    name: 'pl-select-option',
    props: {
        label: {type: [String, Number], required: true},
        val: {type: [String, Number], required: true},
        icon: {type: String},
        disabled: {type: Boolean},

        group: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        SelectCollector.child({injectDefaultValue: null, sort: () => refs.el!})
        const group = SelectGroupCollector.child({injectDefaultValue: null})
        const panel = SelectPanelCollector.child({injectDefaultValue: null, sort: () => refs.el!})
        const isShow = computed(() => (props.group || !panel || panel.utils.isShow(props)))
        const isSelected = computed(() => !!panel && panel.utils.isSelected(props))

        const refer = {
            props,
            refs,
        }

        const classes = useClasses(() => [
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
                            ref: onRef.el,
                            label: props.label,
                            val: props.val,
                            icon: props.icon,
                            class: classes.value,
                            onClick: handler.click,
                        }}>
                        {!!panel && isShow.value && <>
                            {!!panel.props.multiple && !props.group ? <PlCheckbox customReadonly modelValue={isSelected.value} class="pl-select-option-checkbox"/> : null}
                            {!!props.icon && <PlIcon icon={props.icon} class="pl-select-option-icon"/>}
                            {slots.default(props.label)}
                        </>}
                    </div>
                )
            }
        }
    },
})

export type SelectOption = typeof PlSelectOption.use.class

export default PlSelectOption
