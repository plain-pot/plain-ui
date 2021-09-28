import {useClasses, designComponent, useRefs, InheritHtmlElement, createEventListener} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import PlIcon from "../PlIcon";
import './tag.scss'

export const PlTag = designComponent({
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
    inheritPropsType: InheritHtmlElement,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const classes = useClasses(() => ([
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
            refer: {refs},
            render: () => (
                <div class={classes.value} onClick={handler.click} ref={onRef.el}>
                    {slots.default(props.label)}
                    {!!props.close && <PlIcon icon="el-icon-close" class="pl-tag-close" {...createEventListener({onClick: handler.clickClose})}/>}
                </div>
            )
        }
    },
})

export default PlTag
