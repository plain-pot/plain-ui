<template>
    <div class="pl-color-hue-slider" @mousedown="mousedown">
        <div class="pl-color-hue-slider-thumb" :style="thumbStyles" ref="thumb"></div>
    </div>
</template>

<script>

    export default {
        name: "pl-color-hue-slider",
        props: {
            value: {type: Number, default: 0},
        },
        data() {
            return {
                p_left: 0,
                p_tempLeft: 0,
                p_dragWidth: null,
                p_thumbWidth: null,
                p_startX: null,
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.$nextTick(() => this.p_left = val / 360 * this.p_dragWidth)
                },
            }
        },
        computed: {
            thumbStyles() {
                return {
                    left: `${this.p_left}px`
                }
            },
        },
        methods: {
            init() {
                this.p_dragWidth = this.$el.offsetWidth - this.$refs.thumb.offsetWidth
                this.p_thumbWidth = this.$refs.thumb.offsetWidth
            },
            mousedown(e) {
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
                if (e.target === this.$el) {
                    this.p_left = e.offsetX - this.p_thumbWidth / 2
                    this.emitValue()
                }
                this.$plain.$dom.enableSelectNone()
                this.p_startX = e.clientX
                this.p_tempLeft = this.p_left
            },
            mousemove(e) {
                const durX = e.clientX - this.p_startX
                this.p_left = Math.min(this.p_dragWidth, Math.max(0, this.p_tempLeft + durX))
                this.emitValue()
            },
            mouseup(e) {
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
                this.$plain.$dom.disabledSelectNone()
            },
            emitValue() {
                this.$emit('input', (this.p_left / this.p_dragWidth * 360).toFixed(0) - 0)
                this.$emit('change')
            },
        }
    }
</script>