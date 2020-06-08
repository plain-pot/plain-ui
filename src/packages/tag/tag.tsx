import {computed, defineComponent} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {DEFAULT_STATUS} from "@/packages/base";

export default defineComponent({
    name: 'pl-tag',
    props: {
        ...EditProps,
        ...StyleProps,
        mode: {type: String, default: 'stroke'},
        label: {type: String},
        close: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()

        const {emit} = useEvent({
            click: EmitFunc,
            close: EmitFunc,
        })

        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})

        const classes = computed(() => ([
            `pl-tag`,
            `pl-tag-mode-${props.mode}`,
            `pl-tag-status-${styleComputed.value.status}`,
            `pl-tag-shape-${styleComputed.value.shape}`,
            `pl-tag-size-${styleComputed.value.size}`,
            {
                'pl-tag-disabled': !!editComputed.value.disabled,
            },
        ]))

        const handler = {
            click: (e: MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                emit.click(e)
            },
            clickClose: (e: MouseEvent) => {
                e.stopPropagation()
                if (!editComputed.value.editable) {
                    return
                }
                emit.close(e)
            }
        }

        return () => (
            <div class={classes.value} onClick={handler.click}>
                {slots.default(props.label)}
                {!!props.close && <pl-icon icon="el-icon-close" class="pl-tag-close" onClick={handler.clickClose}/>}
            </div>
        )
    },
})