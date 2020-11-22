import {computed, onMounted, reactive, watch} from 'vue'
import {designComponent} from "../../use/designComponent";
import './carousel.scss'
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import Item from './carousel-item'
import {useCollect} from "../../use/useCollect";
import {useModel} from "../../use/useModel";
import {useRefs} from "../../use/useRefs";
import {useScopedSlots} from "../../use/useScopedSlots";

export const Carousel = designComponent({
    name: 'pl-carousel',
    props: {
        modelValue: {type: [String, Number]},                       // 双向绑定值
        height: {type: [Number, String], default: 225},             // 轮播高度
        autoplay: {type: Number, default: 3000},                    // 自定播放时间，为0则取消自动播放
        disabledOperator: {type: Boolean},                          // 禁用前后按钮
        disabledIndicator: {type: Boolean},                         // 禁用指示器
        indicatorTrigger: {type: String, default: 'click'},         // 指示器激活触发器：click。hover
    },
    emits: {
        updateModelValue: (val: string | number | undefined | null) => true,
    },
    setup({props, event: {emit}}) {

        /*子元素*/
        const items = CarouselCollector.parent()
        const {scopedSlots} = useScopedSlots({
            indicator: {val: String, index: Number, active: Boolean}
        })
        const {slots} = useSlots([
            'cover',
        ], true)
        const {propsState} = useProps(props, {
            height: useProps.NUMBER,
        })
        const {refs} = useRefs({
            el: HTMLDivElement
        })
        const state = reactive({
            width: 0,                                                   // 容器宽度
            autoplayTimer: null as null | number,                       // 自动播放定时器
            prevActiveIndex: null as null | number,                     // 上一个激活的index，当元素个数为3时，需要通过这个属性优化动画
        })

        /*双向绑定值*/
        const model = useModel(() => props.modelValue, emit.updateModelValue)
        /*子元素val数组*/
        const vals = computed(() => items.map(item => String(item.itemVal.value)!))
        /*当前激活的元素的val值*/
        const activeVal = computed(() => {
            if (vals.value.length === 0) {
                return null
            }
            if (model.value != null) {
                return String(model.value)
            } else {
                return vals.value[0]
            }
        })
        /*当前激活的元素的val的在 数组中的索引*/
        const activeIndex = computed(() => {
            if (!activeVal.value) {
                return 0
            }
            return vals.value.indexOf(activeVal.value)
        })

        /*实际渲染的，排序过的val数组*/
        const sortVals = computed(() => {
            const valArray = vals.value
            let prev = valArray.slice(0, activeIndex.value)
            let next = valArray.slice(activeIndex.value + 1)

            if (Math.abs(prev.length - next.length) > 1) {
                if (prev.length > next.length) {
                    while (prev.length - next.length > 1) {
                        next.push(prev.shift()!)
                    }
                } else {
                    while (next.length - prev.length > 1) {
                        prev.unshift(next.pop()!)
                    }
                }
            }
            return [...prev, activeVal.value, ...next]
        })

        const styles = useStyles(style => {
            style.height = unit(propsState.height)
        })

        const utils = {
            /**
             * 子元素的左偏移位置
             * @author  韦胜健
             * @date    2020/11/22 23:19
             */
            getLeft: (val: any) => {
                if (!state.width) {
                    return null
                }
                let duration = sortVals.value.indexOf(String(val)) - sortVals.value.indexOf(String(activeVal.value))
                return {
                    left: duration * state.width,
                    zIndex: sortVals.value.length - Math.abs(duration),
                }
            },
            /**
             * 重置自动播放定时器
             * @author  韦胜健
             * @date    2020/11/22 23:19
             */
            resetAutoplayTimer: (autoplay: number | null) => {
                /*无论怎么样都要清理掉定时器*/
                if (!!state.autoplayTimer) {
                    clearInterval(state.autoplayTimer)
                    state.autoplayTimer = null
                }
                /*如果autoplay有值，重新设定一个自动播放定时器*/
                if (!!autoplay) {
                    state.autoplayTimer = setInterval(methods.next, autoplay)
                }
            },
            /**
             * 子元素是否需要动画（当元素为3时，只有prevActiveIndex以及activeIndex的元素需要动画，另一个需要立刻移动到对应的位置）
             * @author  韦胜健
             * @date    2020/11/22 23:20
             */
            isAnimating: (val: any) => {
                if (vals.value.length !== 3) {
                    return true
                }
                let index = vals.value.indexOf(val)
                return index === state.prevActiveIndex || index === activeIndex.value
            },
        }

        const methods = {
            /**
             * 显示上一个元素
             * @author  韦胜健
             * @date    2020/11/22 23:21
             */
            prev: () => {
                state.prevActiveIndex = activeIndex.value
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) - 1]!
            },
            /**
             * 显示下一个元素
             * @author  韦胜健
             * @date    2020/11/22 23:21
             */
            next: () => {
                state.prevActiveIndex = activeIndex.value
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) + 1]!
            },
            /**
             * 显示特定元素
             * @author  韦胜健
             * @date    2020/11/22 23:21
             */
            show: (val: any) => {
                state.prevActiveIndex = activeIndex.value
                model.value = val

                utils.resetAutoplayTimer(props.autoplay)
            },
        }

        const handler = {
            onPrev: () => {
                utils.resetAutoplayTimer(props.autoplay)
                methods.prev()
            },
            onNext: () => {
                utils.resetAutoplayTimer(props.autoplay)
                methods.next()
            },
            onIndicator: (index: number) => {
                methods.show(vals.value[index])
            },
        }

        onMounted(() => {
            state.width = refs.el.offsetWidth
        })

        watch(() => props.autoplay, utils.resetAutoplayTimer, {immediate: true})

        return {
            refer: {
                utils,
                methods,
            },
            render: () => (
                <div class="pl-carousel" style={styles.value} ref="el">
                    {slots.default()}
                    {slots.cover.isExist() && <div class="pl-carousel-cover">
                        {slots.cover()}
                    </div>}

                    {!props.disabledOperator && <div class="pl-carousel-operator">
                        <div class="pl-carousel-operator-btn pl-carousel-operator-prev" onClick={handler.onPrev}>
                            <pl-icon icon="el-icon-arrow-left"/>
                        </div>
                        <div class="pl-carousel-operator-btn pl-carousel-operator-next" onClick={handler.onNext}>
                            <pl-icon icon="el-icon-arrow-right"/>
                        </div>
                    </div>}

                    {!props.disabledIndicator && <div class="pl-carousel-indicator">
                        {items.map((item, index) => (
                            scopedSlots.indicator({val: String(item.itemVal.value), index, active: index === activeIndex.value}, (
                                <div
                                    {...{
                                        [props.indicatorTrigger === 'hover' ? 'onMouseenter' : 'onClick']: () => handler.onIndicator(index)
                                    }}
                                    class={[
                                        'pl-carousel-indicator-item',
                                        {
                                            'pl-carousel-indicator-item-active': index === activeIndex.value,
                                        }
                                    ]} key={index}/>
                            ))
                        ))}
                    </div>}
                </div>
            )
        }
    },
})

export const CarouselCollector = useCollect(() => ({
    parent: Carousel,
    child: Item,
}))