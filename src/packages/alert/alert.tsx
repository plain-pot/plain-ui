import {computed, defineComponent} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {$plain, DEFAULT_STATUS} from "@/packages/base";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-alert',
    props: {
        ...StyleProps,

        title: {type: String},
        message: {type: String},
        icon: {type: String},
    },
    setup(props,) {

        const {slots, $slots} = useSlots({
            title: SlotFunc,
        })

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})

        const icon = computed(() => {
            if (props.icon === null) {
                return null
            }
            return props.icon || $plain.STATUS[styleComputed.value.status].icon
        })

        const classes = computed(() => [
            'pl-alert',
            `pl-alert-status-${styleComputed.value.status}`,
            `pl-alert-shape-${styleComputed.value.shape}`,
            {
                'pl-alert-has-icon': !!icon.value,
                'pl-alert-has-title': !!props.title || $slots.title,
            }
        ])

        return () => (
            <div class={classes.value}>
                {(!!props.title || $slots.title) && (
                    <div class={'pl-alert-title'}>
                        {slots.title(props.title)}
                    </div>
                )}
                {(!!props.message || $slots.default) && (
                    <div class={'pl-alert-message'}>
                        {slots.default(props.message)}
                    </div>
                )}
                <div class="pl-alert-icon">
                    <pl-icon icon={icon.value}/>
                </div>
            </div>
        )
    },
})