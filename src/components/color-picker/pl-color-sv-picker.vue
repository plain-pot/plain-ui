<template>
    <div class="pl-color-sv-picker" :style="styles">
        <div class="pl-color-sv-picker-layer pl-color-sv-picker-white"></div>
        <div class="pl-color-sv-picker-layer pl-color-sv-picker-black"></div>
        <div class="pl-color-sv-picker-layer pl-color-sv-picker-thumb-panel" @mousedown.stop="mousedown" ref="thumbPanel">
            <div class="pl-color-sv-picker-thumb-wrapper" :style="thumbWrapperStyles">
                <div class="pl-color-sv-picker-thumb"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {hsv2rgb} from "./index";

    export default {
        name: "pl-color-sv-picker",
        props: {
            hue: {type: Number},
            saturation: {type: Number},
            value: {type: Number},
        },
        watch: {
            saturation(val) {
                if (this.p_saturation !== val) this.p_saturation = val
            },
            value(val) {
                if (this.p_value !== 100 - val) this.p_value = (100 - val)
            },
        },
        data() {
            return {
                p_saturation: this.saturation,
                p_value: 100 - (this.value || 0),
                p_length: null,
                p_startX: null,
                p_startY: null,
                p_tempSaturation: this.saturation || 0,
                p_tempValue: 100 - (this.value || 0),
            }
        },
        computed: {
            styles() {
                const color = hsv2rgb(this.hue, 100, 100)
                return {
                    height: `${this.p_length}px`,
                    backgroundColor: `rgb(${color.r},${color.g},${color.b})`
                }
            },
            thumbWrapperStyles() {
                return {
                    top: `${this.p_value}%`,
                    left: `${this.p_saturation}%`
                }
            },
        },
        methods: {
            init() {
                this.p_length = this.$el.offsetWidth
            },
            mousedown(e) {
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
                this.$plain.$dom.enableSelectNone()
                if (e.target === this.$refs.thumbPanel) this.updatePosition(e.offsetX, e.offsetY)
                this.p_startX = e.clientX
                this.p_startY = e.clientY
                this.p_tempSaturation = this.p_saturation
                this.p_tempValue = this.p_value
            },
            mousemove(e) {
                this.updatePosition(e.clientX - this.p_startX, e.clientY - this.p_startY, false)
            },
            mouseup(e) {
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
                this.$plain.$dom.disabledSelectNone()
            },
            updatePosition(x, y, isMouseDown = true) {
                const durX = (x / this.p_length * 100).toFixed(0) - 0
                const durY = (y / this.p_length * 100).toFixed(0) - 0
                this.p_saturation = (isMouseDown ? 0 : this.p_tempSaturation) + durX
                this.p_value = (isMouseDown ? 0 : this.p_tempValue) + durY
                this.p_saturation = Math.max(0, Math.min(100, this.p_saturation))
                this.p_value = Math.max(0, Math.min(100, this.p_value))
                this.$emit('update:saturation', this.p_saturation)
                this.$emit('update:value', 100 - this.p_value)
                this.$emit('change')
            },
        }
    }
</script>