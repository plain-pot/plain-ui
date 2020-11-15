import {designComponent} from "../../use/designComponent";
import {PROGRESS_DEFAULT_PROPS} from "./progress.utils";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useRefs} from "../../use/useRefs";
import {reactive, computed, watch, onMounted} from 'vue';
import {throttle} from "plain-utils/utils/throttle";

export const ProgressCircle = designComponent({
    name: 'pl-progress-circle',
    props: {
        ...PROGRESS_DEFAULT_PROPS,

        size: {type: Number, default: 100},                                                     // 大小尺寸
        lineSize: {type: Number, default: 6},                                                   // 线条尺寸
        startAngle: {type: Number, default: -0.5 * Math.PI},                                    // 起始角度
    },
    setup({props}) {
        const {scopedSlots} = useScopedSlots({
            default: {animatePercent: Number, value: Number}
        })

        const {refs} = useRefs({
            canvas: HTMLCanvasElement,
        })

        const state = reactive({
            ctx: null as any,
            animatePercent: 0,
            cancelAnimate: null as null | number,
        })

        const arcParam = computed(() => {
            return [props.size / 2, props.size / 2, props.size / 2 - props.lineSize,]
        })

        const utils = {
            animateDrawing: throttle((percent: number) => {
                if (!!state.cancelAnimate) {
                    cancelAnimationFrame(state.cancelAnimate)
                }

                let time = 300
                let startTime = Date.now()

                let n = state.animatePercent
                let k = (percent - n) / time

                const run = () => {
                    let nowTime = Date.now()
                    let deltaTime = nowTime - startTime

                    if (deltaTime > time) {
                        state.cancelAnimate = null
                        state.animatePercent = percent
                        utils.draw(state.animatePercent)
                        return
                    }

                    state.animatePercent = Number((deltaTime * k + n).toFixed(2))
                    utils.draw(state.animatePercent)

                    state.cancelAnimate = requestAnimationFrame(run)
                }

                run()
            }, 300, {trailing: true, leading: true}),
            draw: (animatePercent: number) => {
                state.ctx.clearRect(0, 0, props.size, props.size)
                utils.drawOuterCircle()
                utils.drawInnerCircle(animatePercent)
            },
            drawOuterCircle: () => {
                state.ctx.save();                                                                        //save和restore可以保证样式属性只运用于该段canvas元素
                state.ctx.beginPath();                                                                   //开始路径
                state.ctx.strokeStyle = props.outerColor;                                                 //设置边线的颜色
                state.ctx.lineWidth = props.lineSize;
                state.ctx.arc(...arcParam.value, 0, Math.PI * 2, false);                                  //画一个圆的路径
                state.ctx.stroke();                                                                      //绘制边线
                state.ctx.closePath();
            },
            drawInnerCircle: (animatePercent: number) => {
                state.ctx.save();
                state.ctx.strokeStyle = props.status === 'normal' ? props.innerColor : props.status === 'success' ? props.successColor : props.errorColor
                state.ctx.lineWidth = props.lineSize;
                state.ctx.lineCap = 'round';
                state.ctx.beginPath();
                state.ctx.arc(...arcParam.value, props.startAngle, props.startAngle + animatePercent / 100 * 2 * Math.PI, false);
                state.ctx.stroke();
                state.ctx.restore();
            },
        }

        const methods = {
            reload: () => {
                utils.animateDrawing(props.modelValue || 0)
            },
        }

        watch(() => props.modelValue, () => {
            methods.reload()
        })

        onMounted(() => {
            state.ctx = refs.canvas!.getContext("2d")
            methods.reload()
        })

        return {
            render: () => (
                <div class="pl-progress-circle">
                    <canvas ref="canvas" height={props.size} width={props.size}/>
                    <div class="pl-progress-circle-label">
                        {props.status === 'normal' && scopedSlots.default({animatePercent: state.animatePercent, value: props.modelValue}, (
                            <span>{state.animatePercent}%</span>
                        ))}
                        {props.status === 'success' && <pl-icon icon="el-icon-check-bold" class="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                        {props.status === 'error' && <pl-icon icon="el-icon-close-bold" class="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                    </div>
                </div>
            )
        }
    },
})