import {computed} from 'vue'
import {designComponent} from "../../../../src/use/designComponent";
import {DemoUseCollector} from "./demo-use-collect-parent";
import {useModel} from "../../../../src/use/useModel";
import {useSlots} from "../../../../src/use/useSlots";
import {useRefs} from "../../../../src/use/useRefs";

export const DemoUseCollectChildComponent = designComponent({
    props: {
        label: {type: String},
        val: {type: [String, Number]},
        modelValue: {},
        trueValue: {default: true},
        falseValue: {default: false},
    },
    emits: {
        updateModelValue: (val: any) => true
    },
    setup({props, event}) {

        const {refs} = useRefs({
            button: HTMLButtonElement
        })
        const parent = DemoUseCollector.child({injectDefaultValue: null, sort: () => refs.button})

        const {slots} = useSlots()

        const modelValue = useModel(() => props.modelValue, event.emit.updateModelValue, {
            autoEmit: !parent,
            autoWatch: !parent,
        })

        const handler = {
            click: () => {
                if (!!parent) {
                    parent.handler.clickItem(props.val!)
                } else {
                    modelValue.value = isChecked.value ? props.falseValue : props.trueValue
                }
            }
        }

        const isChecked = computed(() => {
            if (!parent) {
                return modelValue.value === props.trueValue
            } else {
                return parent.utils.isChecked(props.val!)
            }
        })

        const classes = computed(() => [
            'demo-use-collect-child',
            {
                'demo-use-collect-child-checked': isChecked.value
            }
        ])

        return {
            refer: {
                props,
            },
            render: () => (
                <button onClick={handler.click} class={classes.value} ref="button">
                    {slots.default(props.label)}
                </button>
            )
        }
    },
})