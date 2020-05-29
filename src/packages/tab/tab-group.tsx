import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {TabHeadStyle, TabPosition} from "@/packages/tab/tab-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";

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

        const state = reactive({
            items: [] as any[]
        })

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => [
            'pl-tab-group',
        ])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            addItem: (item) => {
                const index = item.methods.getIndex()
                state.items.splice(index, 0, item)
            },
            removeItem: (item) => {
                state.items.splice(state.items.indexOf(item), 1)
            },
        }

        const ctx = useRefer({
            state,
            utils,
        })

        provide(TAB_GROUP_PROVIDER, ctx)

        return () => (
            <div class={classes.value}>
                <span class="pl-tab-group-slot">{slots.default()}</span>
                <div>
                    {state.items.map((item, index) => (
                        <div key={index}>
                            {item.props.title}-{index}
                        </div>
                    ))}
                </div>
            </div>
        )
    },
})