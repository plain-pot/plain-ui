import {computed, defineComponent, onMounted, reactive, watch} from "@vue/composition-api";
import {PROGRESS_DEFAULT_PROPS} from "@/packages/progress/progress";
import {$plain} from "@/packages/base";
import {ElRef, useRefs} from "@/use/useRefs";

export default defineComponent({
    name: 'pl-progress-mini',
    props: {
        value: {type: Number, default: 100},
        size: {default: 16},
        ...PROGRESS_DEFAULT_PROPS,
        innerColor: {type: String, default: 'rgba(0,0,0,0.6)'},
        reverse: {type: Boolean},
    },
    setup(props) {

        const refs = useRefs({
            canvas: ElRef,
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
            animateDrawing: $plain.utils.throttle((percent) => {
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
                utils.animateDrawing(props.value || 0)
            },
        }

        watch(() => props.value, methods.reload, {lazy: true})
        watch(() => props.status, () => {
            $plain.nextTick(() => utils.draw())
        }, {lazy: true})

        onMounted(() => {
            // @ts-ignore
            state.ctx = refs.canvas.getContext("2d")
            methods.reload()
        })

        return () => (
            <div class={classes.value}>
                <canvas class="pl-progress-mini-canvas" ref="canvas" width={props.size} height={props.size}/>
            </div>
        )
    },
})