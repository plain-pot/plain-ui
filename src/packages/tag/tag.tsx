import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {useSlots} from "../../use/useSlots";
import {DEFAULT_STATUS} from "../../utils/constant";
import {computed} from 'vue';
import './tag.scss'

export default designComponent({
    name: 'pl-tag',
    props: {
        ...EditProps,
        ...StyleProps,
        mode: {type: String, default: 'stroke'},
        label: {type: String},
        close: {type: Boolean},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
        onClose: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {
        const {slots} = useSlots()
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
                emit.onClick(e)
            },
            clickClose: (e: MouseEvent) => {
                e.stopPropagation()
                if (!editComputed.value.editable) {
                    return
                }
                emit.onClose(e)
            }
        }

        return {
            render: () => (
                <div class={classes.value} onClick={handler.click}>
                    {slots.default(props.label)}
                    {!!props.close && <pl-icon icon="el-icon-close" class="pl-tag-close" onClick={handler.clickClose}/>}
                </div>
            )
        }
    },
})