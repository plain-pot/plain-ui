import {computed, defineComponent, onMounted, provide, reactive} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {useCollectParent} from "@/use/useCollect";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {TabHeaderPosition, TabHeaderType} from "@/packages/tab-header/tab-header";

export const TAB_GROUP_PROVIDER = '@@TAB_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-tab-group',
    props: {
        value: {},
        headType: {type: String, default: TabHeaderType.text},
        headPosition: {type: String, default: TabHeaderPosition.top},
        closeIcon: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()
        const {emit} = useEvent({
            input: EmitFunc,
            clickHeadItem: (item: any, index: number) => undefined,
            close: (item: any, index: number) => undefined,
        })

        /*---------------------------------------state-------------------------------------------*/

        const items = useCollectParent(true, undefined, (removeItem) => {
            if (removeItem.targetVal.value === model.value) {
                let index = items.value.indexOf(removeItem)
                if (!!items.value[index + 1]) {
                    model.value = items.value[index + 1].targetVal.value
                } else if (!!items.value[index - 1]) {
                    model.value = items.value[index - 1].targetVal.value
                } else {
                    model.value = null
                }
            }
        })
        const model = useModel(() => props.value, emit.input)

        /*---------------------------------------computer-------------------------------------------*/

        const classes = computed(() => [
            'pl-tab-group',
        ])

        const innerGroupClasses = computed(() => [
            'pl-tab-inner-group',
            `pl-tab-inner-group-head-position-${props.headPosition}`,
            `pl-tab-inner-group-direction-${['top', 'bottom'].indexOf(props.headPosition) > -1 ? 'horizontal' : 'vertical'}`
        ])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {}

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            clickHeadItem: (item, index) => {
                model.value = item.targetVal.value
                emit.clickHeadItem(item, index)
            },
            clickCloseIcon: (item, index) => {
                emit.close(item, index)
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
            return (
                <div class={classes.value}>
                    <span class="pl-tab-group-slot">{slots.default()}</span>

                    <div class={innerGroupClasses.value}>
                        <pl-tab-header type={props.headType} position={props.headPosition}>
                            {items.value.map((item, index) => (
                                <pl-tab-header-item key={index} active={item.targetVal.value === model.value} onClick={() => handler.clickHeadItem(item, index)}>
                                    <span>{item.props.title}</span>
                                    {!!props.closeIcon && <pl-icon icon="el-icon-close" onClick={() => handler.clickCloseIcon(item, index)}/>}
                                </pl-tab-header-item>
                            ))}
                        </pl-tab-header>

                        <div class="pl-tab-group-inner-tab-list">
                            {items.value.map((item, index) => (
                                <pl-inner-tab item={item} index={index}/>
                            ))}
                        </div>
                    </div>

                </div>
            )
        }
    },
})