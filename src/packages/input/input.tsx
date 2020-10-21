import {computed, ref} from 'vue';
import './input.scss'
import {designComponent} from "../../use/designComponent";
import {useModel} from "../../use/useModel";
import {useSlots} from "../../use/useSlots";

export const Input = designComponent({
    name: 'pl-input',
    props: {
        modelValue: {},
        icon: {},
    },
    emits: {
        updateModelValue: (val: any) => true
    },
    setup({props, event: {emit}}) {

        const inputRef = ref(null as null | HTMLInputElement)

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const {slots, $slots} = useSlots([
            'prepend',      // 前置插槽
            'append',       // 后置插槽
        ])

        const classes = computed(() => {
            return [
                'pl-input',
                {
                    'pl-input-has-prepend': !!$slots.prepend,
                }
            ]
        })

        const methods = {
            focus() {
                inputRef.value!.focus()
            },
            blur() {
                inputRef.value!.focus()
            },
            clear() {
                model.value = null
            },
        }

        return {
            refer: {
                methods,
            },
            render: () => {
                console.log('render')
                return (
                    <div class={classes.value}>
                        {slots.prepend([
                            'default prepend',
                            <button>ICON</button>,
                        ])}
                        <input type="text" v-model={model.value} ref={inputRef}/>
                        <button onClick={() => model.value = ''}>clear</button>
                        {slots.append('default append')}
                    </div>
                )
            }
        }
    },
})