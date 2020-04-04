<template>
    <div class="pl-color-sv-panel" :style="styles" @mousedown="mouseHandler.mousedown" @dblclick="onDblclick">
        <span class="pl-color-sv-thumb" :style="thumbStyles"/>
    </div>
</template>

<script lang="ts">
    import {EmitMixin, PropsMixinFactory} from "../../../utils/mixins";
    import {hsv2rgb} from "../ColorUtils";

    export default {
        name: "pl-color-sv-panel",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                height: PropsMixinFactory.Number,
                width: PropsMixinFactory.Number,
            }),
        ],
        emitters: {
            emitChange: Function,
            emitDblclick: Function,
        },
        props: {
            hue: {type: Number, default: 360},                      // 色相
            saturation: {type: Number},                             // 饱和度
            value: {type: Number},                                  // 亮度

            height: {type: [String, Number], default: 180},         // 面板高度
            width: {type: [String, Number], default: 240},          // 面板宽度
        },
        data() {
            const p_value = this.value == null ? null : 100 - (this.value || 0)
            const p_saturation = this.saturation

            const mouseHandler = {
                mousedown: (e) => {
                    document.body.addEventListener('mousemove', mouseHandler.mousemove)
                    document.body.addEventListener('mouseup', mouseHandler.mouseup)
                    this.$plain.enableSelectNone()
                    this.updatePosition(e.offsetX, e.offsetY)
                    this.p_startX = e.clientX
                    this.p_startY = e.clientY
                    this.p_tempSaturation = this.p_saturation
                    this.p_tempValue = this.p_value
                },
                mousemove: (e) => {
                    this.updatePosition(e.clientX - this.p_startX, e.clientY - this.p_startY, false)
                },
                mouseup: (e) => {
                    document.body.removeEventListener('mousemove', mouseHandler.mousemove)
                    document.body.removeEventListener('mouseup', mouseHandler.mouseup)
                    this.$plain.disabledSelectNone()
                }
            }

            return {
                p_saturation,
                p_value,

                p_startX: null,
                p_startY: null,
                p_tempSaturation: p_saturation,
                p_tempValue: p_value,

                mouseHandler,
            }
        },
        computed: {
            styles() {
                const color = hsv2rgb(this.hue, 100, 100)
                return {
                    width: this.$plain.utils.suffixPx(this.width),
                    height: this.$plain.utils.suffixPx(this.height),
                    backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                }
            },
            thumbStyles() {
                let {p_value: value, p_saturation: saturation} = this
                value = value == null ? 50 : value
                saturation = saturation == null ? 50 : saturation

                return {
                    transform: `translate3d(${saturation * this.p_width / 100}px,${value * this.p_height / 100}px,0)`,
                }
            },
        },
        methods: {
            updatePosition(x: number, y: number, isMouseDown = true): void {
                const durX = Number((x / this.p_width * 100).toFixed(0))
                const durY = Number((y / this.p_height * 100).toFixed(0))

                this.p_saturation = (isMouseDown ? 0 : this.p_tempSaturation) + durX
                this.p_value = (isMouseDown ? 0 : this.p_tempValue) + durY
                this.p_saturation = Math.max(0, Math.min(100, this.p_saturation))
                this.p_value = Math.max(0, Math.min(100, this.p_value))

                this.emitChange({hue: this.hue, saturation: this.p_saturation, value: this.p_value})
            },
            async onDblclick(e) {
                await this.$plain.nextTick()
                this.emitDblclick(e)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-sv-panel {
            position: relative;
            box-shadow: 0 0px 4px 0 rgba(0, 0, 0, 0.4);
            cursor: pointer;

            &:before, &:after, & span {
                pointer-events: none;
            }

            &, &:before, &:after {
                border-radius: 4px;
            }

            &:before, &:after {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                content: '';
            }

            &:before {
                background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
            }

            &:after {
                background: linear-gradient(to top, black, rgba(255, 255, 255, 0));
            }

            .pl-color-sv-thumb {
                display: inline-block;
                position: absolute;
                width: 1px;
                height: 1px;
                left: 0;
                top: 0;
                z-index: 1;

                &:after {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border: solid 1px #999;
                    border-radius: 10px;
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    content: '';
                    box-sizing: border-box;
                    background-color: white;
                }
            }
        }
    }
</style>