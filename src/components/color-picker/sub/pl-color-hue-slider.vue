<template>
    <div class="pl-color-hue-slider" @mousedown="mousedown" :style="styles">
        <div class="pl-color-hue-slider-thumb" :style="thumbStyles"></div>
    </div>
</template>

<script>

    import {EmitMixin, PropsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "pl-color-hue-slider",
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
            value: {type: Number, default: 0},                          // 当前色相
            size: {type: [String, Number]},                             // 宽度
            thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
        },
        data() {
            return {
                p_left: 0,                                              // 指示器左偏移位置
                p_tempLeft: 0,                                          // 拖拽的时候，指示器的缓存左偏移位置
                p_startX: null,                                         // 拖拽的时候起始位置
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.$nextTick(() => this.setLeft(val / 360 * this.p_width))
                },
            }
        },
        computed: {
            /**
             * 根节点yangshi
             * @author  韦胜健
             * @date    2020/4/4 13:07
             */
            styles() {
                return {
                    width: this.$plain.utils.suffixPx(this.p_size)
                }
            },
            /**
             * 指示器样式
             * @author  韦胜健
             * @date    2020/4/4 13:07
             */
            thumbStyles() {
                return {
                    left: `${this.p_left}px`,
                    width: this.$plain.utils.suffixPx(this.p_thumbSize)
                }
            },
            /**
             * 实际总宽度
             * @author  韦胜健
             * @date    2020/4/4 13:07
             */
            p_width() {
                return this.p_size - this.p_thumbSize
            },
        },
        methods: {
            setLeft(left) {
                this.p_left = Math.max(0, Math.min(this.p_width, left))
            },
            mousedown(e) {
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
                if (e.target === this.$el) {
                    this.setLeft(e.offsetX - this.p_thumbSize / 2)
                    this.emitValue(this.p_left)
                }
                this.$plain.enableSelectNone()
                this.p_startX = e.clientX
                this.p_tempLeft = this.p_left
            },
            mousemove(e) {
                const durX = e.clientX - this.p_startX
                this.setLeft(this.p_tempLeft + durX)
                this.emitValue(this.p_left)
            },
            mouseup(e) {
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
                this.$plain.disabledSelectNone()
            },
            emitValue() {
                this.emitInput((this.p_left / this.p_width * 360).toFixed(0) - 0)
            },
        }
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-hue-slider {
            background: linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
            display: inline-block;
            height: 10px;
            position: relative;
            cursor: pointer;
            border-radius: 10px;

            .pl-color-hue-slider-thumb {
                display: inline-block;
                height: 100%;
                background-color: white;
                position: absolute;
                top: 0;
                border: solid 1px $colorInfo;
                box-sizing: border-box;
                border-radius: 100px;
            }
        }
    }
</style>