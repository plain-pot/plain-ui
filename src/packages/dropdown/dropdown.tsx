import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import {reactive} from 'vue';
import {SimpleFunction} from "../../shims";

export default designComponent({
    name: 'pl-dropdown',
    props: {
        modelValue: {type: Boolean},
    },
    provideRefer: true,
    emits: {
        updateModelValue: (val: boolean) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots()
        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const state = reactive({
            dropdownGroupSlot: null as null | SimpleFunction,
        })

        return {
            refer: {
                state,
            },
            render: () => (
                <pl-popper
                    trigger="click"
                    v-model={model.value}
                    v-slots={{
                        popper: () => !!state.dropdownGroupSlot ? state.dropdownGroupSlot() : null
                    }}>
                    {slots.default()}
                </pl-popper>
            )
        }
    },
})