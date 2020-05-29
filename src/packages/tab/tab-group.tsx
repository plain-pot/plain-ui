import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {TabHeadStyle, TabPosition} from "@/packages/tab/tab-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {useCollectParent} from "@/use/useCollect";

export const TAB_GROUP_PROVIDER = '@@TAB_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-tab-group',
    props: {
        value: {},
        card: {type: String, default: TabHeadStyle.default},
        position: {type: String, default: TabPosition.top},
        closeIcon: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()

        /*---------------------------------------state-------------------------------------------*/

        const state = reactive({})

        const items = useCollectParent()

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => [
            'pl-tab-group',
        ])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {}

        const ctx = useRefer({
            state,
            utils,
            props,
        })

        provide(TAB_GROUP_PROVIDER, ctx)

        return () => (
            <div class={classes.value}>
                <span class="pl-tab-group-slot">{slots.default()}</span>
                <div>
                    {items.value.map((item, index) => (
                        <div key={index}>
                            {item.props.title}-{index}
                        </div>
                    ))}
                </div>
            </div>
        )
    },
})