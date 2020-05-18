import {computed, defineComponent, inject, provide} from "@vue/composition-api";
import {EditProps, useEdit} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";


export const BUTTON_GROUP_PROVIDER = '@@BUTTON_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-button-group',
    props: {
        mode: {type: String, default: 'fill'},                  // fill,stroke,text
        vertical: {type: Boolean},

        ...EditProps,
        ...StyleProps,
    },
    setup(props, context) {

        const {styleComputed} = useStyle()

        const {editComputed} = useEdit()

        const buttonGroupProvide = computed(() => ({mode: props.mode}))

        provide(BUTTON_GROUP_PROVIDER, buttonGroupProvide)

        const buttonGroup = inject(BUTTON_GROUP_PROVIDER, null) as any

        const otherComputed = computed(() => ({
            mode: !!buttonGroup ? buttonGroup.value.mode : props.mode
        }))

        const classes = computed(() => ([
            `pl-button-group`,
            `pl-button-group-status-${styleComputed.value.status}`,
            `pl-button-group-mode-${otherComputed.value.mode}`,
            `pl-button-group-shape-${styleComputed.value.shape}`,
            `pl-button-group-size-${styleComputed.value.size}`,
            `pl-button-group-direction-${props.vertical ? 'vertical' : 'horizontal'}`,
            {
                'pl-button-group-disabled': !!editComputed.value.disabled,
            },
        ]))

        return () => (
            <div class={classes.value}>
                {context.slots.default && context.slots.default()}
            </div>
        )
    },
})