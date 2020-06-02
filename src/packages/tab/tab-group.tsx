import {computed, defineComponent, onMounted, provide, reactive} from "@vue/composition-api";
import {TabHeadType, TabHeadPosition} from "@/packages/tab/tab-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {useCollectParent} from "@/use/useCollect";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";

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
        const {emit} = useEvent({
            input: EmitFunc,
            clickHeadItem: (item: any, index: number) => undefined,
        })

        /*---------------------------------------state-------------------------------------------*/

        const items = useCollectParent(true)
        const model = useModel(() => props.value, emit.input)

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => [
            'pl-tab-group',
        ])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {}

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            clickHeadItem: (item, index) => {
                model.value = item.targetVal.value
                emit.clickHeadItem(item, index)
            }
        }

        const ctx = useRefer({
            items,
            utils,
            handler,

            props,
            model,
        })

        provide(TAB_GROUP_PROVIDER, ctx)

        onMounted(() => {
            if (model.value == null && !!items.value && items.value.length > 0) {
                model.value = items.value[0].targetVal.value
            }
        })

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