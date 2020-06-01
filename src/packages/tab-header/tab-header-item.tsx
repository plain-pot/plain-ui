import {computed, defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";

export default defineComponent({
    name: 'pl-tab-header-item',
    props: {
        active: {type: Boolean},
    },
    setup(props) {
        return () => {

            const {emit} = useEvent({
                click: EmitFunc,
            })
            const {slots} = useSlots()
            const classes = computed(() => [
                'pl-tab-header-item',
                {
                    'pl-tab-header-item-active': props.active
                }
            ])

            return (
                <div class={classes.value} onClick={emit.click}>
                    <div class="pl-tab-header-item-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})