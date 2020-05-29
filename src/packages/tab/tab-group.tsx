import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {TabHeadType, TabHeadPosition} from "@/packages/tab/tab-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {useCollectParent} from "@/use/useCollect";

export const TAB_GROUP_PROVIDER = '@@TAB_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-tab-group',
    props: {
        value: {},
        headType: {type: String, default: TabHeadType.default},
        headPosition: {type: String, default: TabHeadPosition.top},
        closeIcon: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()

        /*---------------------------------------state-------------------------------------------*/

        const items = useCollectParent(true)

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => [
            'pl-tab-group',
        ])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {}

        const ctx = useRefer({
            items,
            utils,
            props,
        })

        provide(TAB_GROUP_PROVIDER, ctx)


        return () => {

            const Component = ['top', 'bottom'].indexOf(props.headPosition) > -1 ? 'pl-tab-group-horizontal' : 'pl-tab-group-vertical'

            return (
                <div class={classes.value}>
                    <span class="pl-tab-group-slot">{slots.default()}</span>
                    {items.value.length > 0 && <Component/>}
                </div>
            )
        }
    },
})