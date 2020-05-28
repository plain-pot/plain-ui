import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export const COLLAPSE_GROUP_PROVIDER = '@@COLLAPSE_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-collapse-group',
    props: {
        limit: {type: Number},                                  // 限制最多能展开的个数
        shape: {type: String, default: 'none'},                 // 形状
    },
    setup(props) {

        const {slots} = useSlots()

        const state = reactive({
            items: [] as any[],
            stack: [] as any[],
        })

        const methods = {
            addItem: (item) => {
                state.items.push(item)
                if (item.model.value) {
                    state.stack.push(item)
                }
            },
            removeItem: (item) => {
                state.items.splice(state.items.indexOf(item), 1)
                const stackIndex = state.stack.indexOf(item)
                if (stackIndex > -1) {
                    state.stack.splice(stackIndex, 1)
                }
            },
        }

        const handler = {
            clickItem:(item)=>{
                if (!item.model.value) {
                    item.methods.open()
                    state.stack.push(item)

                    if (!!props.limit && props.limit > 0 && state.stack.length > props.limit) {
                        const item = state.stack.shift()
                        item.methods.close()
                    }
                } else {
                    state.stack.splice(state.stack.indexOf(item), 1)
                    item.methods.close()
                }
            }
        }

        const classes = computed(() => ([
            'pl-collapse-group',
            `pl-collapse-group-shape-${props.shape}`
        ]))

        provide(COLLAPSE_GROUP_PROVIDER, {
            state,
            methods,
            handler,
        })

        return () => (
            <div class={classes.value}>
                {slots.default()}
            </div>
        )
    },
})