import './carousel.scss'
import {computed, designComponent, InheritHtmlElement, onMounted, reactive, useClasses, useModel, useRefs, useStyles, watch} from "plain-ui-composition";
import {unit} from "plain-utils/string/unit";
import {throttle} from "plain-utils/utils/throttle";
import PlIcon from "../PlIcon";
import PlCarouselItem from "../PlCarouselItem";
import {useCollect} from "../../use/useCollect";

export const PlCarousel = designComponent({
    name: 'pl-carousel',
    props: {
        modelValue: {type: [String, Number]},                       // 双向绑定值
        height: {type: [Number, String], default: 225},             // 轮播高度
        autoplay: {type: Number, default: 3000},                    // 自定播放时间，为0则取消自动播放
        disabledOperator: {type: Boolean},                          // 禁用前后按钮
        disabledIndicator: {type: Boolean},                         // 禁用指示器
        indicatorTrigger: {type: String, default: 'click'},         // 指示器激活触发器：click。hover
        vertical: {type: Boolean},                                  // 轮播方向为纵向
        card: {type: Boolean},                                      // 卡片形式的切换
        cardScale: {type: Number, default: 0.64},                   // 卡片形式轮播的时候，缩小比例
    },
    inheritPropsType: InheritHtmlElement,
    scopeSlots: {
        indicator: (scope: { val: string, index: number, active: boolean }) => {},
    },
    slots: ['cover', 'default'],
    emits: {
        onUpdateModelValue: (val: string | number | undefined | null) => true,
    },
    setup({props, slots, scopeSlots, event: {emit}}) {

        /*子元素*/
        const items = CarouselCollector.parent()

        const {refs, onRef} = useRefs({
            el: HTMLDivElement
        })
        const state = reactive({
            width: 0,                                                   // 容器宽度
            height: 0,                                                  // 容器高度
            autoplayTimer: null as null | number,                       // 自动播放定时器
            prevActiveIndex: null as null | number,                     // 上一个激活的index，当元素个数为3时，需要通过这个属性优化动画
        })

        /*双向绑定值*/
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        /*子元素val数组*/
        const vals = computed(() => items.map(item => String(item.itemVal)!))
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

        const classes = useClasses(() => [
            'pl-carousel',
            {
                'pl-carousel-vertical': props.vertical,
                'pl-carousel-card': props.card,
            }
        ])
        const styles = useStyles(style => {
            style.height = unit(props.height)
        })

        const utils = {
            /**
             * 子元素的左偏移位置
             * @author  韦胜健
             * @date    2020/11/22 23:19
             */
            getItemStyles: (val: any) => {
                if (!state.width) {
                    return null
                }
                /*当前val在sortVals中的索引*/
                const sortIndex = sortVals.value.indexOf(String(val))
                /*激活val在sortVals中的索引*/
                const activeSortIndex = sortVals.value.indexOf(String(activeVal.value))

                /*当前val与激活val在sortVal的间距*/
                let duration = sortIndex - activeSortIndex

                const style = {
                    zIndex: sortVals.value.length - Math.abs(duration),
                } as any

                if (!props.vertical) {
                    if (!props.card) {
                        /*非卡片形式的轮播*/
                        style.transform = `translateX(${duration * state.width}px)`
                    } else {
                        style.width = `${props.cardScale * 100}%`
                        style.height = `${props.cardScale * 100}%`

                        /*卡片轮播*/
                        let left = duration * state.width * (props.cardScale) + (state.width * (1 - props.cardScale) / 2)
                        left += (sortIndex > activeSortIndex ? -1 : 1) * Math.abs(sortIndex - activeSortIndex) * state.width * 0.125
                        style.transform = `translateX(${left}px) translateY(${state.height * ((1 - props.cardScale) / 2)}px) scale(${sortIndex === activeSortIndex ? '1' : '0.83'})`
                    }
                } else {
                    /*纵向非卡片形式的轮播*/
                    style.transform = `translateY(${duration * state.height}px)`
                }

                return style
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
                    state.autoplayTimer = setInterval(methods.next, autoplay) as any as number
                }
            },
            /**
             * 子元素是否需要动画（当元素为3时，只有prevActiveIndex以及activeIndex的元素需要动画，另一个需要立刻移动到对应的位置）
             * @author  韦胜健
             * @date    2020/11/22 23:20
             */
            isAnimating: (val: any) => {
                if (vals.value.length !== 3 && !props.card) {
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
            onPrev: throttle(() => {
                utils.resetAutoplayTimer(props.autoplay)
                methods.prev()
            }, 500, {trailing: true, leading: true}),
            onNext: throttle(() => {
                utils.resetAutoplayTimer(props.autoplay)
                methods.next()
            }, 500, {trailing: true, leading: true}),
            onIndicator: (index: number) => {
                methods.show(vals.value[index])
            },
        }

        onMounted(() => {
            state.width = refs.el!.offsetWidth
            state.height = refs.el!.offsetHeight
        })

        watch(() => props.autoplay, utils.resetAutoplayTimer, {immediate: true})

        return {
            refer: {
                refs,
                utils,
                methods,
            },
            render: () => (
                <div class={classes.value} style={styles.value} ref={onRef.el}>
                    {slots.default()}
                    {slots.cover.isExist() && <div class="pl-carousel-cover">
                        {slots.cover()}
                    </div>}

                    {!props.disabledOperator && <div class="pl-carousel-operator">
                        <div class="pl-carousel-operator-btn pl-carousel-operator-prev" onClick={handler.onPrev}>
                            <PlIcon icon="el-icon-arrow-left"/>
                        </div>
                        <div class="pl-carousel-operator-btn pl-carousel-operator-next" onClick={handler.onNext}>
                            <PlIcon icon="el-icon-arrow-right"/>
                        </div>
                    </div>}

                    {!props.disabledIndicator && <div class="pl-carousel-indicator">
                        {items.map((item, index) => (
                            scopeSlots.indicator({val: String(item.itemVal), index, active: index === activeIndex.value}, (
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

export default PlCarousel

export const CarouselCollector = useCollect(() => ({
    parent: PlCarousel,
    child: PlCarouselItem,
}))
