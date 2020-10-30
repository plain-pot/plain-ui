import {designComponent} from "../../../../src/use/designComponent";
import {useSlots} from "../../../../src/use/useSlots";
import {useCollect} from "../../../../src/use/useCollect";
import {DemoUseCollectChildComponent} from "./demo-use-collect-child";
import {useModel} from "../../../../src/use/useModel";

export const DemoUseCollectParentComponent = designComponent({
    props: {
        parentName: {type: String},
        modelValue: {},
    },
    emits: {
        updateModelValue: (val: undefined | (string | number)[]) => true
    },
    setup({props, event}) {
        const {slots} = useSlots()

        const children = DemoUseCollector.parent()

        const modelValue = useModel(() => props.modelValue as undefined | (string | number)[], event.emit.updateModelValue)

        const utils = {
            isChecked: (val: string | number) => {
                return ((modelValue.value) || []).indexOf(val) > -1
            }
        }

        const handler = {
            clickItem: (val: string | number) => {
                if (!modelValue.value) {
                    return modelValue.value = [val]
                }
                const index = modelValue.value.indexOf(val)
                if (modelValue.value.indexOf(val) > -1) {
                    modelValue.value.splice(index, 1)
                } else {
                    modelValue.value.push(val)
                }
            },
            toggleCheckAll: () => {
                if (!!modelValue.value && modelValue.value.length === children.length) {
                    modelValue.value = []
                } else {
                    modelValue.value = children.map(child => child.props.val!)
                }
            }
        }

        return {
            refer: {
                handler,
                utils,
            },
            render: () => (
                [
                    <button class="demo-use-collect-child" onClick={handler.toggleCheckAll}>
                        全选
                    </button>,
                    slots.default(),
                ]
            )
        }
    },
})

export const DemoUseCollector = useCollect(() => ({parent: DemoUseCollectParentComponent, child: DemoUseCollectChildComponent}))