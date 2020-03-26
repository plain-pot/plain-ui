<template>
    <div class="pl-progress-mini" :class="classes">
        <canvas class="pl-progress-mini-canvas" ref="canvas" :width="size" :height="size"></canvas>
    </div>
</template>

<script>
    import {getDefaultProgressProps} from "./index";

    export default {
        name: "pl-progress-mini",
        props: {
            value: {type: Number, default: 100},
            size: {default: 16},
            ...getDefaultProgressProps(),
            innerColor: {type: String, default: '#999'},
            reverse: {type: Boolean},
        },
        watch: {
            value(val) {
                this.reload()
            },
            status(val) {
                this.$nextTick(() => this.draw(this.animatePercent))
            },
        },
        data() {

            /**
             * 使用动画调整进度
             * @author  韦胜健
             * @date    2020/3/26 15:28
             */
            let animateDrawing = this.$plain.utils.throttle((percent) => {
                if (!!this.cancelAnimate) {
                    cancelAnimationFrame(this.cancelAnimate)
                }

                let time = 300
                let startTime = Date.now()

                let n = this.animatePercent
                let k = (percent - n) / time

                const run = () => {
                    let nowTime = Date.now()
                    let deltaTime = nowTime - startTime

                    if (deltaTime > time) {
                        this.cancelAnimate = null
                        this.animatePercent = percent
                        this.draw(this.animatePercent)
                        return
                    }

                    this.animatePercent = Number((deltaTime * k + n).toFixed(2))
                    this.draw(this.animatePercent)

                    this.cancelAnimate = requestAnimationFrame(run)
                }

                run()
            }, 300, {trailing: true, leading: true})

            return {
                ctx: null,
                animatePercent: 0,
                cancelAnimate: null,
                animateDrawing,
            }
        },
        mounted() {
            this.ctx = this.$refs.canvas.getContext("2d")
            this.reload()
        },
        computed: {
            arcParam() {
                return [this.size / 2, this.size / 2, this.size / 2, 0]
            },
            color() {
                switch (this.status) {
                    case 'success':
                        return this.successColor
                    case 'error':
                        return this.errorColor
                    default:
                        return this.innerColor
                }
            },
            percent() {
                return this.reverse ? ((100 - this.animatePercent) / 100) : (this.animatePercent / 100)
            },
            classes() {
                return [
                    {
                        [`pl-progress-mini-status-${this.status}`]: !!this.status,
                    },
                ]
            },
        },
        methods: {
            reload() {
                this.animateDrawing(this.value || 0)
            },
            draw(animatePercent) {
                this.ctx.clearRect(0, 0, this.size, this.size)
                this.drawSector(animatePercent)
            },
            drawSector() {
                this.ctx.save();

                this.ctx.fillStyle = this.color
                this.ctx.beginPath()
                this.ctx.moveTo(this.size / 2, this.size / 2)
                this.ctx.arc(...this.arcParam, (this.percent) * Math.PI * 2, false);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            },
        }
    }
</script>

<style lang="scss">
    .pl-progress-mini {
        display: inline-block;
        vertical-align: middle;

        canvas {
            display: block;
        }
    }
</style>
