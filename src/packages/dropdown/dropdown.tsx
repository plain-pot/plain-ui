import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import {reactive} from 'vue';
import {SimpleFunction} from "../../shims";

export default designComponent({
    name: 'pl-dropdown',
    props: {
        modelValue: {type: Boolean},
        disabledHideOnClickOption: {type: Boolean},                     // 禁用点击 dropdown-option 之后关闭 dropdown
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

        const handler = {
            clickOptoin: (e: MouseEvent) => {
                if (!props.disabledHideOnClickOption) {
                    model.value = false
                }
            }
        }

        return {
            refer: {
                state,
                handler,
            },
            render: () => (
                <pl-popper
                    trigger="click"
                    v-model={model.value}
                    noContentPadding
                    transition="pl-transition-popper-drop"
                    v-slots={{
                        popper: () => !!state.dropdownGroupSlot ? state.dropdownGroupSlot() : null
                    }}>
                    {slots.default()}
                </pl-popper>
            )
        }
    },
})