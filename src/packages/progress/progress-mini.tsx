import {designComponent} from "../../use/designComponent";
import {PROGRESS_DEFAULT_PROPS} from "./index";
import {useRefs} from "../../use/useRefs";
import {reactive, computed, watch, nextTick, onMounted} from 'vue';
import {throttle} from "plain-utils/utils/throttle";

export const ProgressMini = designComponent({
    name: 'pl-progress-mini',
    props: {
        size: {default: 16},
        ...PROGRESS_DEFAULT_PROPS,
        innerColor: {type: String, default: 'rgba(0,0,0,0.6)'},
        reverse: {type: Boolean},
    },
    setup({props}) {
        const {refs} = useRefs({
            canvas: HTMLCanvasElement,
        })

        const state = reactive({
            ctx: null as any,
            animatePercent: 0,
            cancelAnimate: null as null | number,
        })

        /*---------------------------------------computer-------------------------------------------*/

        const arcParam = computed(() => {
            return [props.size / 2, props.size / 2, props.size / 2, 0]
        })

        const color = computed(() => {
            switch (props.status) {
                case 'success':
                    return props.successColor
                case 'error':
                    return props.errorColor
                default:
                    return props.innerColor
            }
        })

        const percent = computed(() => {
            return props.reverse ? ((100 - state.animatePercent) / 100) : (state.animatePercent / 100)
        })

        const classes = computed(() => [
            'pl-progress-mini',
            {
                [`pl-progress-mini-status-${props.status}`]: !!props.status,
            },
        ])

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
                        utils.draw()
                        return
                    }

                    state.animatePercent = Number((deltaTime * k + n).toFixed(2))
                    utils.draw()

                    state.cancelAnimate = requestAnimationFrame(run)
                }

                run()
            }, 300, {trailing: true, leading: true}),
            draw: () => {
                state.ctx.clearRect(0, 0, props.size, props.size)
                utils.drawSector()
            },
            drawSector: () => {
                state.ctx.save();

                state.ctx.fillStyle = color.value
                state.ctx.beginPath()
                state.ctx.moveTo(props.size / 2, props.size / 2)
                state.ctx.arc(...arcParam.value, (percent.value) * Math.PI * 2, false);
                state.ctx.closePath();
                state.ctx.fill();
                state.ctx.restore();
            }
        }

        const methods = {
            reload: () => {
                utils.animateDrawing(props.modelValue || 0)
            },
        }

        watch(() => props.modelValue, methods.reload)
        watch(() => props.status, () => {
            nextTick().then(() => utils.draw())
        })

        onMounted(() => {
            state.ctx = refs.canvas.getContext("2d")
            methods.reload()
        })

        return {
            render: () => (
                <div class={classes.value}>
                    <canvas class="pl-progress-mini-canvas" ref="canvas" width={props.size} height={props.size}/>
                </div>
            )
        }
    },
})