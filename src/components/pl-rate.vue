<template>
    <div class="pl-rate" @mousedown="p_mousedown" :class="classes">
        <div class="pl-rate-active" :style="activeStyles">
            <pl-icon v-for="(index) in data" :icon="activeIcon||'pad-star-fill'" :key="index"/>
        </div>
        <div class="pl-rate-inactive">
            <pl-icon v-for="(index) in data" :icon="inactiveIcon||'pad-star'" :key="index"/>
        </div>
    </div>
</template>

<script>

    import {MountedMixin, ValueMixin} from "../mixin/component-mixin";
    import PlIcon from "./pl-icon";

    export default {
        name: "pl-rate",
        components: {PlIcon},
        mixins: [ValueMixin, MountedMixin],
        props: {
            value: {type: Number, default: 0},                              //vModel双向绑定值
            total: {type: Number, default: 5},                              //总分
            count: {type: Number, default: 5},                              //显示图标的个数
            mode: {type: String, default: 'normal'},                        //模式，normal，all整个图标为单位，half：半个图标为单位
            color: {type: String, default: 'warn'},                         //标准颜色
            activeIcon: {type: String},                                     //激活的时候的图标
            inactiveIcon: {type: String},                                   //未激活的时候的图标
        },
        data() {
            return {
                _totalWidth: null,
                _elLeft: null,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-rate-color-${this.color}`
                ]
            },
            data() {
                let i = 0
                let ret = []
                while (i < this.count) {
                    ret.push(i)
                    i++
                }
                return ret
            },
            activeStyles() {
                return {
                    width: (this.p_value / this.total) * 100 + '%'
                }
            },
            totalWidth() {
                if (!this.p_mounted) return 0
                if (!this._totalWidth) this._totalWidth = this.$el.offsetWidth
                return this._totalWidth
            },
            elLeft() {
                if (!this._elLeft) this._elLeft = this.$el.getBoundingClientRect().left
                return this._elLeft
            },
        },
        methods: {
            p_mousedown(e) {
                window.document.addEventListener('mousemove', this.p_mousemove)
                window.document.addEventListener('mouseup', this.p_mouseup)
                this.$plain.$dom.enableSelectNone()
                this.reset(e)
            },
            p_mousemove(e) {
                this.reset(e)
            },
            p_mouseup(e) {
                window.document.removeEventListener('mousemove', this.p_mousemove)
                window.document.removeEventListener('mouseup', this.p_mouseup)
                this.$plain.$dom.disabledSelectNone()
            },
            reset(e) {
                let dur = e.clientX - this.elLeft
                let start = 0
                let end = this.totalWidth
                let step = end / this.count
                switch (this.mode) {
                    case 'all':
                        for (; start < end; start += step) {
                            if (start < dur && dur < start + step) {
                                dur = start + step
                                break
                            }
                        }
                        break
                    case 'half':
                        for (; start < end; start += step) {
                            let half = (start + start + step) / 2
                            if (start < dur && dur < half) {
                                dur = half
                                break
                            }
                            if (half < dur && dur < start + step) {
                                dur = start + step
                                break
                            }
                        }
                        break
                }

                let ret = (Math.max(0, Math.min((dur) / this.totalWidth, 1)) * this.total).toFixed(2) - 0
                this.p_value = ret
                this.p_emitValue()
            },
        }
    }
</script>