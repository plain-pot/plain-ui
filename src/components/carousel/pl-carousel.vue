<template>
    <div class="pl-carousel">
        <div class="pl-carousel-content" :style="contentStyles" :class="{'pl-carousel-content-moving':!!p_moving}">
            <div class="pl-carousel-item" v-for="(item,index) in data" :key="index">
                <slot :item="item" :index="index"></slot>
            </div>
        </div>
        <div class="pl-carousel-dot" v-if="!disabledDot">
            <div class="pl-carousel-dot-item"
                 v-for="(item,index) in data"
                 @click.stop="p_clickDot(item,index)"
                 :key="index" :class="{'pl-carousel-dot-item-active':index === p_value}">
            </div>
        </div>
        <div class="pl-carousel-prev-button" v-if="!disabledButton">
            <span @click="p_clickButton(false)"><pl-icon icon="el-icon-arrow-left"/></span>
        </div>
        <div class="pl-carousel-next-button" v-if="!disabledButton">
            <span @click="p_clickButton(true)"><pl-icon icon="el-icon-arrow-right"/></span>
        </div>
        <slot name="hover"></slot>
    </div>
</template>

<script>
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-carousel",
        mixins: [
            EmitMixin,
        ],
        props: {
            value: {type: Number},
            data: {type: Array, default: () => []},                     //遍历的数组数据
            disabledSwipe: {type: Boolean,},                            //禁用滑动
            autoPlay: {type: Boolean},                                  //自定播放
            autoPlayDuration: {type: Number, default: 3000},            //自动播放的时间间隔
            disabledButton: {type: Boolean},                            //禁用左右翻页按钮
            disabledDot: {type: Boolean},                               //禁用指示器
        },
        emitters: {
            emitInput: Function,
        },
        watch: {
            value(val) {
                if (this.p_value !== val && val > -1 && val < this.data.length) {
                    this.p_value = val
                    this.p_x = -val * this.p_containerWidth
                }
            },
        },
        data() {
            return {
                p_value: this.value,

                p_watchValue: false,
                p_containerWidth: 0,
                p_startX: 0,
                p_x: 0,
                p_tempX: 0,
                p_moving: false,
                p_timer: null,
            }
        },
        mounted() {
            this.p_containerWidth = this.$el.offsetWidth
            !this.disabledSwipe && this.$el.addEventListener('mousedown', this.p_mousedown)
            this.play()

            if (!this.data || this.data.length === 0) return
            this.p_value = this.value == null ? 0 : this.value
            this.update()
        },
        computed: {
            contentStyles() {
                return {
                    transform: `translateX(${this.p_x}px)`,
                }
            },
        },
        methods: {
            refresh() {
                this.p_containerWidth = this.$el.offsetWidth
            },
            next() {
                if (!this.data || this.data.length === 0) return
                const target = this.p_value + 1
                const last = this.data.length - 1
                this.p_value = target > last ? last : target
                this.update()
                this.emitInput(this.p_value)
            },
            prev() {
                if (!this.data || this.data.length === 0) return
                const target = this.p_value - 1
                this.p_value = target < 0 ? 0 : target
                this.update()
                this.emitInput(this.p_value)
            },
            update() {
                this.p_x = -this.p_value * this.p_containerWidth
            },
            play() {
                if (!this.autoPlay || !this.data || this.data.length === 0) return
                if (this.p_value === this.data.length - 1) {
                    this.p_value = -1
                    this.emitInput(this.p_value)
                }
                this.p_clearTimer()
                this.timer = setTimeout(() => {
                    this.next()
                    this.play()
                }, this.autoPlayDuration)
            },
            p_clickButton(next = true) {
                this.play()
                next ? this.next() : this.prev()
            },
            p_clearTimer() {
                if (!!this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
            },
            p_clickDot(item, index) {
                this.p_value = index
                this.emitInput(this.p_value)
                this.update()
            },
            p_mousedown(e) {
                this.p_clearTimer()
                this.p_moving = true
                this.p_tempX = this.p_x
                this.p_startX = e.clientX
                window.document.addEventListener('mousemove', this.p_mousemove)
                window.document.addEventListener('mouseup', this.p_mouseup)
                this.$plain.enableSelectNone()
            },
            p_mousemove(e) {
                if (!this.p_moving) return
                let deltaX = e.clientX - this.p_startX;
                this.p_x = deltaX + this.p_tempX
            },
            p_mouseup(e) {
                if (!this.p_moving) return
                this.p_moving = false
                if (this.p_x > 0) {
                    this.p_x = 0
                    this.p_value = 0
                    this.emitInput(this.p_value)
                    return
                }
                const x = -this.p_x
                for (let i = 0; i < this.data.length - 1; i++) {
                    const current = i * this.p_containerWidth
                    const next = (i + 1) * this.p_containerWidth
                    const half = (current + next) / 2
                    if (current <= x && x <= half) {
                        this.p_x = -current
                        this.p_value = i
                        this.emitInput(this.p_value)
                        this.play()
                        return
                    }
                    if (half <= x && x <= next) {
                        this.p_x = -next
                        this.p_value = i + 1
                        this.emitInput(this.p_value)
                        this.play()
                        return
                    }
                }
                this.p_x = -(this.data.length - 1) * this.p_containerWidth
                this.p_value = this.data.length - 1
                this.emitInput(this.p_value)
                this.$plain.disabledSelectNone()
                window.document.removeEventListener('mousemove', this.p_mousemove)
                window.document.removeEventListener('mouseup', this.p_mouseup)
                this.play()
            },
        }
    }
</script>
