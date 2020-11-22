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

export const Carousel = designComponent({
    name: 'pl-carousel',
    props: {
        modelValue: {type: [String, Number]},                       // 双向绑定值
        height: {type: [Number, String], default: 225},             // 轮播高度
        autoplay: {type: Number, default: 0},                    // 自定播放时间，为0则取消自动播放
        disabledOperator: {type: Boolean},                          // 禁用前后按钮
        disabledIndicator: {type: Boolean},                         // 禁用指示器
    },
    emits: {
        updateModelValue: (val: string | number | undefined | null) => true,
    },
    setup({props, event: {emit}}) {

        const items = CarouselCollector.parent()
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
            width: 0,
            autoplayTimer: null as null | number,
            prevActiveIndex: null as null | number,
        })

        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const vals = computed(() => items.map(item => String(item.value.value)!))
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
        const activeIndex = computed(() => {
            if (!activeVal.value) {
                return 0
            }
            return vals.value.indexOf(activeVal.value)
        })

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
            isAnimating: (val: any) => {
                if (vals.value.length !== 3) {
                    return true
                }
                let index = vals.value.indexOf(val)
                return index === state.prevActiveIndex || index === activeIndex.value
            },
        }

        const methods = {
            prev: () => {
                state.prevActiveIndex = activeIndex.value
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) - 1]!
            },
            next: () => {
                state.prevActiveIndex = activeIndex.value
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) + 1]!
            },
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
            /*console.log({
                'vals': vals.value,
                'activeVal': activeVal.value,
                'activeIndex': activeIndex.value,
                'sortVals': sortVals.value,
            })*/

            state.prevActiveIndex = activeIndex.value
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
                            <div
                                onClick={() => handler.onIndicator(index)}
                                class={[
                                    'pl-carousel-indicator-item',
                                    {
                                        'pl-carousel-indicator-item-active': index === activeIndex.value,
                                    }
                                ]} key={index}/>
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