import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import {reactive} from 'vue';
import {useScopedSlots} from "../../use/useScopedSlots";

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

        const {slots} = useSlots([
            'popper'
        ])
        const {scopedSlots} = useScopedSlots({
            reference: {open: Boolean}
        })

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const state = reactive({})

        const handler = {
            clickDropdownOption: (e: MouseEvent) => {
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
                    v-slots={{popper: slots.popper}}>
                    {scopedSlots.reference(
                        {open: model.value},
                        slots.default()
                    )}
                </pl-popper>
            )
        }
    },
})