import {computed, defineComponent, onMounted, reactive, watch} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {StyleType} from "@/types/utils";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {useScopedSlots} from "@/use/useScopedSlots";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-carousel',
    props: {
        value: {type: Number, default: 0},
        data: {type: Array, default: () => []},                     //遍历的数组数据
        disabledSwipe: {type: Boolean,},                            //禁用滑动
        autoPlay: {type: Boolean},                                  //自定播放
        autoPlayDuration: {type: Number, default: 3000},            //自动播放的时间间隔
        disabledButton: {type: Boolean},                            //禁用左右翻页按钮
        disabledDot: {type: Boolean},                               //禁用指示器
    },
    setup(props) {

        const {scopedSlots} = useScopedSlots({
            default: {item: Object, index: Number}
        })
        const {slots} = useSlots({
            hover: SlotFunc,
        })

        const {emit} = useEvent({
            input: EmitFunc,
        })

        const refs = useRefs()

        const model = useModel(() => props.value, emit.input, false, false)

        const state = reactive({
            containerWidth: null as null | number,
            startX: 0,
            x: 0,
            tempX: 0,
            moving: false,
            timer: null as null | number,
        })

        const contentStyles = computed(() => ({
            transform: `translateX(${state.x}px)`
        } as StyleType))

        const utils = {
            update: () => {
                state.x = -model.value * state.containerWidth!
            },
            clearTimer: () => {
                if (!!state.timer) {
                    clearTimeout(state.timer)
                    state.timer = null
                }
            }
        }

        const methods = {
            refresh: () => {
                state.containerWidth = refs.$el.offsetWidth
            },
            next: () => {
                if (!props.data || props.data.length === 0) return
                const target = model.value + 1
                const last = props.data.length - 1
                model.value = target > last ? last : target
                utils.update()
                emit.input(model.value)
            },
            prev: () => {
                if (!props.data || props.data.length === 0) return
                const target = model.value - 1
                model.value = target < 0 ? 0 : target
                utils.update()
                emit.input(model.value)
            },
            play: () => {
                if (!props.autoPlay || !props.data || props.data.length === 0) {
                    return
                }
                if (model.value === props.data.length - 1) {
                    model.value = -1
                    emit.input(model.value)
                }
                utils.clearTimer()
                state.timer = setTimeout(() => {
                    methods.next()
                    methods.play()
                }, props.autoPlayDuration)
            }
        }


        const handler = {
            clickButton: (next = true) => {
                methods.play()
                next ? methods.next() : methods.prev()
            },
            clickDot: (e: MouseEvent, item, index) => {
                e.preventDefault()
                e.stopPropagation()

                model.value = index
                emit.input(model.value)
                utils.update()
            },
            mouse: {
                down: (e: MouseEvent) => {
                    utils.clearTimer()
                    state.moving = true
                    state.tempX = state.x
                    state.startX = e.clientX

                    document.addEventListener('mousemove', handler.mouse.move)
                    document.addEventListener('mouseup', handler.mouse.up)

                    $plain.disableSelect
                },
                move: (e: MouseEvent) => {
                    if (!state.moving) {
                        return
                    }
                    let deltaX = e.clientX - state.startX
                    state.x = deltaX + state.tempX
                },
                up: () => {
                    if (!state.moving) return
                    state.moving = false
                    if (state.x > 0) {
                        state.x = 0
                        model.value = 0
                        emit.input(model.value)
                        return
                    }
                    const x = -state.x
                    for (let i = 0; i < props.data.length - 1; i++) {
                        const current = i * state.containerWidth!
                        const next = (i + 1) * state.containerWidth!
                        const half = (current + next) / 2
                        if (current <= x && x <= half) {
                            state.x = -current
                            model.value = i
                            emit.input(model.value)
                            methods.play()
                            return
                        }
                        if (half <= x && x <= next) {
                            state.x = -next
                            model.value = i + 1
                            emit.input(model.value)
                            methods.play()
                            return
                        }
                    }
                    state.x = -(props.data.length - 1) * state.containerWidth!
                    model.value = props.data.length - 1
                    emit.input(model.value)
                    $plain.enableSelect
                    window.document.removeEventListener('mousemove', handler.mouse.move)
                    window.document.removeEventListener('mouseup', handler.mouse.up)
                    methods.play()
                },
            }
        }

        onMounted(() => {
            state.containerWidth = refs.$el.offsetWidth
            if (!props.disabledSwipe) {
                refs.$el.addEventListener('mousedown', handler.mouse.down)
            }
            methods.play()
            if (!props.data || props.data.length === 0) return
            model.value = props.value == null ? 0 : props.value
            utils.update()
        })

        watch(() => props.value, (val) => {
            if (model.value !== val && val > -1 && val < props.data.length) {
                model.value = val
                state.x = -val * state.containerWidth!
            }
        }, {lazy: true})


        return () => (
            <div class="pl-carousel">
                <div style={contentStyles.value} class={['pl-carousel-content', {'pl-carousel-content-moving': !!state.moving}]}>
                    {
                        !!props.data && (props.data.map((item, index) => (
                            <div class="pl-carousel-item" key={index}>
                                {scopedSlots.default({
                                    param: {item, index},
                                    content: null,
                                })}
                            </div>
                        )))
                    }
                </div>
                {!props.disabledDot && (
                    <div class="pl-carousel-dot">
                        {
                            !!props.data && props.data.map((item, index) => (
                                <div onClick={e => handler.clickDot(e, item, index)}
                                     key={index} class={['pl-carousel-dot-item', {'pl-carousel-dot-item-active': index === model.value}]}>
                                </div>
                            ))
                        }
                    </div>
                )}
                {
                    !props.disabledButton && (
                        <div class="pl-carousel-prev-button">
                            <span onClick={() => handler.clickButton(false)}><pl-icon icon="el-icon-arrow-left"/></span>
                        </div>
                    )
                }
                {
                    !props.disabledButton && (
                        <div class="pl-carousel-next-button">
                            <span onClick={() => handler.clickButton(true)}><pl-icon icon="el-icon-arrow-right"/></span>
                        </div>
                    )
                }
                {
                    slots.hover()
                }
            </div>
        )
    },
})