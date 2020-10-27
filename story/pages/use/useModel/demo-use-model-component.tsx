import {designComponent} from "../../../../src/use/designComponent";
import {useModel} from "../../../../src/use/useModel";

export const DemoUseModelComponent = designComponent({
    props: {
        modelValue: {},
        start: {},
        end: {},
    },
    emits: {
        updateModelValue: (val: any) => true,
        updateStart: (val: any) => true,
        updateEnd: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const modelValue = useModel(() => props.modelValue, emit.updateModelValue)
        const modelStart = useModel(() => props.start, emit.updateStart)
        const modelEnd = useModel(() => props.end, emit.updateEnd)

        return {
            render: () => {
                return (
                    <div class="demo-use-model-component">
                        <div>
                            <input type="text" v-model={modelValue.value}/>
                        </div>
                        <div>
                            <input type="text" v-model={modelStart.value}/>
                            ~
                            <input type="text" v-model={modelEnd.value}/>
                        </div>
                    </div>
                )
            }
        }
    },
})