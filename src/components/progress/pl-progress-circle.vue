<template>
    <div class="pl-progress-circle">
        <canvas ref="canvas" :height="size" :width="size"></canvas>
        <div class="pl-progress-circle-label">
            <slot :animatePercent="animatePercent" :value="value" v-if="status === 'normal'">
                <span>{{animatePercent}}</span>%
            </slot>
            <pl-icon icon="pad-check" v-if="status === 'success'" :style="{color:successColor}"/>
            <pl-icon icon="pad-close" v-else-if="status === 'error'" :style="{color: errorColor}"/>
        </div>
    </div>
</template>


<script>
    import {getDefaultProgressProps} from "./index";

    export default {
        name: "pl-progress-circle",
        props: {
            value: {type: Number, default: 100},                                                    // 进度百分比，双向绑定值
            size: {type: Number, default: 100},                                                     // 大小尺寸
            lineSize: {type: Number, default: 6},                                                   // 线条尺寸
            startAngle: {type: Number, default: -0.5 * Math.PI},                                    // 起始角度
            ...getDefaultProgressProps(),                                                           // 公共属性
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
        watch: {
            value(val) {
                this.reload()
            },
        },
        computed: {
            /**
             * 圆的参数
             * @author  韦胜健
             * @date    2020/3/26 15:29
             */
            arcParam() {
                return [this.size / 2, this.size / 2, this.size / 2 - this.lineSize,]
            },
        },
        mounted() {
            this.ctx = this.$refs.canvas.getContext("2d")
            this.reload()
        },
        methods: {
            /**
             * 重新加载
             * @author  韦胜健
             * @date    2020/3/26 15:29
             */
            reload() {
                this.animateDrawing(this.value || 0)
            },
            /**
             * 绘制进度
             * @author  韦胜健
             * @date    2020/3/26 15:45
             */
            draw(animatePercent) {
                this.ctx.clearRect(0, 0, this.size, this.size)
                this.drawOuterCircle()
                this.drawInnerCircle(animatePercent)
            },
            /**
             * 绘制最外层细圈
             * @author  韦胜健
             * @date    2020/3/26 15:45
             */
            drawOuterCircle() {
                this.ctx.save();                                                                        //save和restore可以保证样式属性只运用于该段canvas元素
                this.ctx.beginPath();                                                                   //开始路径
                this.ctx.strokeStyle = this.outerColor;                                                 //设置边线的颜色
                this.ctx.lineWidth = this.lineSize;
                this.ctx.arc(...this.arcParam, 0, Math.PI * 2, false);                                  //画一个圆的路径
                this.ctx.stroke();                                                                      //绘制边线
                this.ctx.closePath();
            },
            /**
             * 绘制蓝色外圈
             * @author  韦胜健
             * @date    2020/3/26 15:45
             */
            drawInnerCircle(animatePercent) {
                this.ctx.save();
                this.ctx.strokeStyle = this.status === 'normal' ? this.innerColor : this.status === 'success' ? this.successColor : this.errorColor
                this.ctx.lineWidth = this.lineSize;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.arc(...this.arcParam, this.startAngle, this.startAngle + animatePercent / 100 * 2 * Math.PI, false);
                this.ctx.stroke();
                this.ctx.restore();
            },
        }
    }
</script>
