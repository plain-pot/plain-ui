<template>
    <div class="pl-color-alpha-slider" :style="styles" @mousedown="mousedown">
        <div class="pl-color-alpha-slider-shadow" :style="shadowStyles"></div>
        <div class="pl-color-alpha-slider-thumb" :style="thumbStyles" ref="thumb"></div>
    </div>
</template>

<script>
    export default {
        name: "pl-color-alpha-slider",
        props: {
            color: {},
            value: {type: Number, default: 0},
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.$nextTick(() => this.p_left = val / 100 * this.p_dragWidth)
                },
            },
        },
        data() {
            return {
                backgroundImage: require('src/asserts/opacity.png'),
                p_left: 0,
                p_tempLeft: 0,
                p_dragWidth: null,
                p_thumbWidth: null,
                p_startX: null,
            }
        },
        computed: {
            styles() {
                return {
                    backgroundImage: `url(${this.backgroundImage})`
                }
            },
            shadowStyles() {
                return {
                    background: `linear-gradient(to left, ${this.color}, rgba(255,255,255,0))`,
                }
            },
            thumbStyles() {
                return {
                    left: `${this.p_left}px`
                }
            },
        },
        methods: {
            init(){
                this.p_dragWidth = this.$el.offsetWidth - this.$refs.thumb.offsetWidth
                this.p_thumbWidth = this.$refs.thumb.offsetWidth
            },
            mousedown(e) {
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
                if (e.target !== this.$refs.thumb) {
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
                this.$emit('input', (this.p_left / this.p_dragWidth * 100).toFixed(0) - 0)
                this.$emit('change')
            },
        }
    }
</script>