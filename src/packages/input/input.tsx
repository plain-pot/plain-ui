import {computed, ref} from 'vue';
import './input.scss'
import {designComponent} from "../../use/designComponent";
import {useModel} from "../../use/useModel";

console.log('load input component')

export const Input = designComponent({
    name: 'pl-input',
    props: {
        status: {type: String, default: 'primary'},
        modelValue: {},
    },
    emits: {
        updateModelValue: (val: any) => true
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const classes = computed(() => {
            return [
                'pl-input',
                `pl-input-status-${props.status}`
            ]
        })

        const methods = {
            clear() {
                model.value = null
            },
        }

        return {
            refer: {
                methods,
            },
            render: () => {
                return (
                    <div class={classes.value}>
                        <input type="text" v-model={model.value}/>
                    </div>
                )
            }
        }
    },
})