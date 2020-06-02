import {computed, defineComponent, inject} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {TAB_HEADER_PROVIDER} from "@/packages/tab-header/tab-header";
import {TabHeadPosition} from "@/packages/tab/tab-utils";

export default defineComponent({
    name: 'pl-tab-header-item',
    props: {
        active: {type: Boolean},
    },
    setup(props) {
        return () => {

            const tabHeader = inject(TAB_HEADER_PROVIDER) as any

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
                    {!!tabHeader && tabHeader.type.value === 'fillet' && <pl-fillet-corner top={tabHeader.props.position !== TabHeadPosition.top} start/>}
                    <div class="pl-tab-header-item-content">
                        {slots.default()}
                    </div>
                    {!!tabHeader && tabHeader.type.value === 'fillet' && <pl-fillet-corner top={tabHeader.props.position === TabHeadPosition.top}/>}
                </div>
            )
        }
    },
})