import {designComponent} from "../../../../src/use/designComponent";
import {useModel} from "../../../../src/use/useModel";

export const DemoUseModelComponent = designComponent({
    props: {
        modelValue: {},
        start: {},
        end: {},
        range: {type: Boolean}
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onUpdateStart: (val: any) => true,
        onUpdateEnd: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const modelStart = useModel(() => props.start, emit.onUpdateStart)
        const modelEnd = useModel(() => props.end, emit.onUpdateEnd)

        return {
            render: () => {
                return (
                    <div class="demo-use-model-component">
                        {!props.range ? (
                            <div>
                                <input type="text" v-model={modelValue.value}/>
                            </div>
                        ) : (
                            <div>
                                <input type="text" v-model={modelStart.value}/>
                                ~
                                <input type="text" v-model={modelEnd.value}/>
                            </div>
                        )}
                    </div>
                )
            }
        }
    },
})