import {designComponent} from "@/use/designComponent";
import {useModel} from "@/use/useModel";
import {useSlots} from "@/use/useSlots";
import {computed} from 'vue';
import './input.scss'

export const Input = designComponent({
    name: 'pl-input',
    props: {
        modelValue: {},
    },
    emits: {
        updateModelValue: (val: any) => true
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const {slots, $slots} = useSlots({
            prepend: useSlots.Slots,
            append: useSlots.Slots,
        })

        const classes = computed(() => {
            console.log('$slots.prepend', $slots.prepend)
            return [
                'pl-input',
                {
                    'pl-input-has-prepend': !!$slots.prepend,
                }
            ]
        })

        return {
            render: () => {
                return (
                    <div class={classes.value}>
                        {slots.prepend('default prepend')}
                        <input type="text" v-model={model.value}/>
                        <button onClick={() => model.value = ''}>clear</button>
                        {slots.append('default append')}
                    </div>
                )
            }
        }
    },
})