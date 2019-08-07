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
        },
        watch: {
            value(val) {
                this.animatePercent = val
                this.draw(val)
            },
            status(val) {
                this.$nextTick(() => this.draw(this.animatePercent))
            },
        },
        data() {
            return {
                ctx: null,
                animatePercent: 0,
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
                return (this.animatePercent / 100)
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
                this.animatePercent = 0
                this.DreamLoading()
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
            DreamLoading() {
                if (this.animatePercent <= this.value) {
                    this.animatePercent += this.speed;
                    this.draw(this.animatePercent)
                } else {
                    this.animatePercent = this.value
                    this.draw(this.animatePercent)
                    return
                }
                requestAnimationFrame(this.DreamLoading);
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
