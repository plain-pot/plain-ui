<template>
    <div class="pl-rate" @mousedown="p_mousedown" :class="classes">
        <div class="pl-rate-active" :style="activeStyles">
            <pl-icon v-for="(index) in data" :icon="activeIcon||'el-icon-star-on'" :key="index"/>
        </div>
        <div class="pl-rate-inactive">
            <pl-icon v-for="(index) in data" :icon="inactiveIcon||'el-icon-star-off'" :key="index"/>
        </div>
    </div>
</template>

<script>


    import {EditMixin, EmitMixin, MountedMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-rate",
        mixins: [
            MountedMixin,
            EmitMixin,
            EditMixin,
            StyleMixin,
            PropsMixinFactory.create({
                total: PropsMixinFactory.Number,
                count: PropsMixinFactory.Number,
            }),
        ],
        props: {
            value: {type: Number, default: 0},                              //vModel双向绑定值
            total: {type: Number, default: 5},                              //总分
            count: {type: Number, default: 5},                              //显示图标的个数
            mode: {type: String, default: 'normal'},                        //模式，normal，all整个图标为单位，half：半个图标为单位
            status: {type: String,},                                        //标准颜色
            activeIcon: {type: String},                                     //激活的时候的图标
            inactiveIcon: {type: String},                                   //未激活的时候的图标
        },
        emitters: {
            emitInput: Function,
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_value: this.value,
                _totalWidth: null,
                _elLeft: null,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-rate-status-${this.p_status || 'primary'}`,
                    `pl-rate-size-${this.p_size || 'normal'}`,
                    {
                        'pl-rate-disabled': this.isDisabled,
                    },
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
                if (!this.isMounted) return 0
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
                if (!this.isEditable) return

                window.document.addEventListener('mousemove', this.p_mousemove)
                window.document.addEventListener('mouseup', this.p_mouseup)
                this.$plain.enableSelectNone()
                this.reset(e)
            },
            p_mousemove(e) {
                this.reset(e)
            },
            p_mouseup(e) {
                window.document.removeEventListener('mousemove', this.p_mousemove)
                window.document.removeEventListener('mouseup', this.p_mouseup)
                this.$plain.disabledSelectNone()
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
                this.emitInput(this.p_value)
            },
        }
    }
</script>