<template>
    <div class="pl-color-alpha-slider" :style="styles" @mousedown="mousedown">
        <div class="pl-color-alpha-shadow" :style="shadowStyles"></div>
        <span class="pl-color-alpha-thumb" :style="thumbStyles"/>
    </div>
</template>

<script>
    import {EmitMixin, PropsMixinFactory} from "../../../utils/mixins";

    const bg = require('./opacity.png')

    export default {
        name: "pl-color-alpha-slider",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                size: PropsMixinFactory.Number,
                thumbSize: PropsMixinFactory.Number,
            })
        ],
        emitters: {
            emitInput: Function,
        },
        props: {
            color: {type: String},
            value: {type: Number, default: 0},
            size: {type: [String, Number]},
            thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
        },
        data() {
            return {
                p_top: 0,
                p_tempTop: 0,
                p_startY: null,
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.$nextTick(() => this.setTop(val / 100 * this.p_height))
                },
            }
        },
        computed: {
            styles() {
                return {
                    height: this.$plain.utils.suffixPx(this.p_size),
                    backgroundImage: `url(${bg})`,
                }
            },
            shadowStyles() {
                return {
                    background: `linear-gradient(to top, ${this.color}, rgba(255,255,255,0))`,
                }
            },
            /**
             * 指示器样式
             * @author  韦胜健
             * @date    2020/4/4 13:07
             */
            thumbStyles() {
                return {
                    top: `${this.p_top}px`,
                    width: this.$plain.utils.suffixPx(this.p_thumbSize)
                }
            },
            /**
             * 实际总宽度
             * @author  韦胜健
             * @date    2020/4/4 13:07
             */
            p_height() {
                return this.p_size - this.p_thumbSize
            },
        },
        methods: {
            setTop(top) {
                this.p_top = Math.max(0, Math.min(this.p_height, top))
            },
            mousedown(e) {
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
                if (e.target === this.$el) {
                    this.setTop(e.offsetY - this.p_thumbSize / 2)
                    this.emitValue(this.p_top)
                }
                this.$plain.enableSelectNone()
                this.p_startY = e.clientY
                this.p_tempTop = this.p_top
            },
            mousemove(e) {
                const durY = e.clientY - this.p_startY
                this.setTop(this.p_tempTop + durY)
                this.emitValue(this.p_top)
            },
            mouseup(e) {
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
                this.$plain.disabledSelectNone()
            },
            emitValue() {
                this.emitInput((this.p_top / this.p_height * 100).toFixed(0) - 0)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-alpha-slider {
            width: 10px;
            background-size: 10px 10px;
            position: relative;
            cursor: pointer;
            border-radius: 10px;
            display: inline-block;

            .pl-color-alpha-shadow, .pl-color-alpha-thumb {
                pointer-events: none;
            }

            .pl-color-alpha-shadow {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 10px;
            }

            .pl-color-alpha-thumb {
                width: 10px;
                height: 10px;
                border-radius: 10px;
                border: solid 1px $colorInfo;
                display: inline-block;
                background-color: white;
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
            }
        }
    }
</style>