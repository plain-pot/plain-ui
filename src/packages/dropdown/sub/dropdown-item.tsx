import {defineComponent, inject} from "@vue/composition-api";
import {DROPDOWN_CONTENT_PROVIDER} from "@/packages/dropdown/sub/dropdown-content";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-dropdown-item',
    props: {
        label: {type: [String, Object]},
        icon: {type: String},
        disabled: {type: Boolean}
    },
    setup(props) {

        const {handler: {clickItem}} = inject(DROPDOWN_CONTENT_PROVIDER) as any

        const {slots} = useSlots()

        const {emit} = useEvent({
            click: EmitFunc,
        })

        const handler = {
            click: (e: MouseEvent) => {
                if (!props.disabled) {
                    emit.click(e)
                    clickItem(e, props)
                }
            }
        }

        return () => {
            return (
                <div onClick={handler.click} class={['pl-dropdown-item', {'pl-dropdown-item-disabled': props.disabled}]}>
                    {!!props.icon && <pl-icon icon={props.icon}/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})