import {computed, defineComponent} from "@vue/composition-api";
import {EditProps, EmitFunc, StyleProps, useEdit, useEmit, useStyle} from "@/util/use";

export default defineComponent({
    name: 'pl-tag',
    props: {
        ...EditProps,
        ...StyleProps,
        mode: {type: String, default: 'stroke'},
        label: {type: String},
        close: {type: Boolean},
    },
    setup(props, context) {

        const emit = useEmit(context, {
            click: EmitFunc,
            close: EmitFunc,
        })

        const {editComputed} = useEdit(props)
        const styleState = useStyle(props)

        const classes = computed(() => ([
            `pl-tag`,
            `pl-tag-mode-${props.mode}`,
            `pl-tag-status-${styleState.value.status}`,
            `pl-tag-shape-${styleState.value.shape}`,
            `pl-tag-size-${styleState.value.size}`,
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
                {!!context.slots.default ? context.slots.default() : props.label}
                {!!props.close && <pl-icon icon="el-icon-close" class="pl-tag-close" onClick={handler.clickClose}/>}
            </div>
        )
    },
})