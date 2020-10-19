import {designComponent} from "@/use/designComponent";
import {useModel} from "@/use/useModel";

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

        return {
            render: () => {
                return (
                    <div>
                        <input type="text" v-model={model.value}/>
                        <button onClick={() => model.value = ''}>clear</button>
                    </div>
                )
            }
        }
    },
})