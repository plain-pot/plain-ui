import {computed, designComponent, useModel} from "plain-ui-composition";

export const PlCheckbox = designComponent({
    props: {
        label: {type: String},
        modelValue: {},
        trueValue: {default: true as any},
        falseValue: {default: false as any},
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const isChecked = computed(() => model.value === props.trueValue)

        const handleClick = () => {
            model.value = isChecked.value ? props.falseValue : props.trueValue
        }

        return () => (
            <button onClick={handleClick}>
                {props.label}:
                {isChecked.value ? '是' : '否'}
            </button>
        )
    },
})

export default PlCheckbox