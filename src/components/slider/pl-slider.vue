<template>
    <div class="pl-slider" :class="p_classes" :style="p_styles">
        <div class="pl-slider-step" v-if="showSteps&&step>1">
            <span class="pl-slider-step-item-wrapper" v-for="(item) in steps" :key="item">
                <div class="pl-slider-step-item" :style="stepItemStyles"></div>
            </span>
        </div>
        <div class="pl-slider-progress" :style="p_progressStyles">
            <span class="pl-slider-dot-wrapper pl-slider-dot-wrapper-start" @mousedown="e=>dragStart(e,true)"><span class="pl-slider-dot"><span class="pl-slider-dot-inner">
                <span class="pl-slider-dot-tooltip" v-if="tooltip">{{startTooltip}}</span>
            </span></span></span>
            <span class="pl-slider-dot-wrapper pl-slider-dot-wrapper-end" @mousedown="e=>dragStart(e,false)"><span class="pl-slider-dot"><span class="pl-slider-dot-inner">
                <span class="pl-slider-dot-tooltip" v-if="tooltip">{{endTooltip}}</span>
            </span></span></span>
        </div>
    </div>
</template>

<script>

    import {EditMixin, EmitMixin, MountedMixin, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-slider",
        mixins: [
            MountedMixin,
            EmitMixin,
            EditMixin,
            StyleMixin,
        ],
        props: {
            value: {type: Number, default: 0},                          //非范围选择时，双向绑定值
            start: {type: Number, default: 0},                          //范围选择时，起始绑定值
            end: {type: Number, default: 0},                            //范围选择时，末尾绑定值
            total: {type: Number, default: 100},                        //总数，value,start以及end不应该超过total
            alignEnd: {type: Boolean},                                  //是否末尾对其
            full: {type: Boolean},                                      //是否占满父元素大小
            length: {type: Number | String, default: '156px'},          //滑动条长度
            size: {type: Number | String, default: '6px'},              //滑动条宽度
            vertical: {type: Boolean},                                  //是否纵向
            step: {type: Number, default: 1},                           //滑条分块的个数，默认是不分块
            min: {type: Number},                                        //最小值
            max: {type: Number},                                        //最大值

            showSteps: {type: Boolean, default: true},                  //是否显示步骤点
            tooltip: {type: Boolean, default: true},                    //是否tooltip显示值
            tooltipFormatter: {type: Function},                         //tooltip显示格式化函数
            range: {type: Boolean},                                     //是否为范围选择
        },
        emitters: {
            emitInput: Function,
            emitUpdateStart: Function,
            emitUpdateEnd: Function,
        },
        data() {
            return {
                p_value: this.value || 0,
                p_start: this.start || 0,
                p_end: this.end || 0,
                p_dragStart: null,
                p_touching: false,
                temp_start: null,
                temp_end: null,
                startX: null,
                startY: null,
                _totalLength: null,
                position: {
                    'vertical-start': 'bottom',
                    'vertical-end': 'top',
                    'horizontal-start': 'right',
                    'horizontal-end': 'left',
                },
            }
        },
        watch: {
            value(val) {
                if (val === this.p_value) return
                this.p_value = val
            },
            p_value(val) {
                this.emitInput(val)
            },
            start(val) {
                if (val === this.p_start) return
                this.p_start = val
            },
            p_start(val) {
                this.emitUpdateStart(val)
            },
            end(val) {
                if (val === this.p_end) return
                this.p_end = val
            },
            p_end(val) {
                this.emitUpdateEnd(val)
            },
        },
        computed: {
            p_styles() {
                return {
                    [this.vertical ? 'height' : 'width']: !!this.full ? '100%' : this.$plain.utils.unit(this.length),
                    [this.vertical ? 'width' : 'height']: this.$plain.utils.unit(this.size),
                }
            },
            p_classes() {
                return [
                    {
                        'pl-slider-full': !!this.full,
                        'pl-slider-touching': this.p_touching,
                        'pl-slider-range': this.range,
                        'pl-slider-place-end': this.p_start === this.p_end && this.p_start === this.total
                    },
                    `pl-slider-${!!this.vertical ? 'vertical' : 'horizontal'}`,
                    `pl-slider-align-${!!this.alignEnd ? 'end' : 'start'}`,
                    `pl-slider-status-${!!this.isDisabled ? 'info' : (this.p_status || 'primary')}`,

                ]
            },
            totalLength() {
                if (!this.isMounted) return 0
                if (this._totalLength == null) this._totalLength = this.$el[!!this.vertical ? 'offsetHeight' : 'offsetWidth']
                return this._totalLength
            },
            c_start() {
                return !!this.range ? this.transferValueToLength(this.p_start) : this.alignEnd ? (this.totalLength - this.transferValueToLength(this.p_value)) : 0
            },
            c_end() {
                return !!this.range ? this.totalLength - this.transferValueToLength(this.p_end) : this.alignEnd ? 0 : (this.totalLength - this.transferValueToLength(this.p_value))
            },
            p_progressStyles() {
                const ret = {}
                ret[this.vertical ? 'top' : 'left'] = `${this.c_start}px`
                ret[this.vertical ? 'bottom' : 'right'] = `${this.c_end}px`
                return ret
            },
            startTooltip() {
                let ret = !!this.range ? this.p_start : this.p_value
                return !!this.tooltipFormatter ? this.tooltipFormatter(ret) : ret
            },
            endTooltip() {
                let ret = !!this.range ? this.p_end : this.p_value
                return !!this.tooltipFormatter ? this.tooltipFormatter(ret) : ret
            },
            steps() {
                const ret = []
                let i = 0
                while (i < this.step - 1) {
                    ret.push(i)
                    i++
                }
                return ret
            },
            stepItemStyles() {
                return {
                    ['height']: this.$plain.utils.unit(this.$plain.utils.removePx(this.size) / 2),
                    ['width']: this.$plain.utils.unit(this.$plain.utils.removePx(this.size) / 2),
                }
            },
        },
        methods: {
            dragStart(e, dragStart) {
                if ((!!this.alignEnd !== dragStart && !this.range) || !this.isEditable) return
                document.addEventListener('mousemove', this.dragMove)
                document.addEventListener('mouseup', this.dragEnd)
                this.p_dragStart = dragStart
                this.p_touching = true
                this.startX = e.clientX
                this.startY = e.clientY
                this.temp_start = this.c_start
                this.temp_end = this.c_end
                this.$plain.enableSelectNone()
            },
            dragMove(e) {
                if (!this.p_touching) return
                const durX = e.clientX - this.startX
                const durY = e.clientY - this.startY
                let temp = !!this.p_dragStart ? this.temp_start : this.temp_end
                let dur = (!!this.vertical ? durY : durX) * (!!this.p_dragStart ? 1 : -1)
                let ret = Math.min(Math.max(temp + dur, 0), this.totalLength)

                if (this.step > 1) {
                    const stepLength = this.totalLength / this.step
                    const divisor = (ret / stepLength).toFixed(0) - 0 + 1
                    if (ret > stepLength * divisor) ret = stepLength * divisor
                    else ret = stepLength * (divisor - 1)
                }

                this[`p_${!!this.p_dragStart ? 'start' : 'end'}`] = this.transferLengthToValue(ret)

                if (!this.range) {
                    ret = this.transferLengthToValue(this.totalLength - ret).toFixed(2) - 0
                    this.max != null && ret > this.max && (ret = this.max)
                    this.min != null && ret < this.min && (ret = this.min)
                    this.p_value = ret
                } else {
                    ret = this.transferLengthToValue(this.p_dragStart ? ret : this.totalLength - ret).toFixed(2) - 0
                    this.max != null && ret > this.max && (ret = this.max)
                    this.min != null && ret < this.min && (ret = this.min)
                    if (!!this.p_dragStart) {
                        if (ret > this.p_end) ret = this.p_end
                    } else {
                        if (ret < this.p_start) ret = this.p_start
                    }
                    this[this.p_dragStart ? 'p_start' : 'p_end'] = ret
                }
            },
            dragEnd(e) {
                if (!this.p_touching) return
                this.p_touching = false
                document.removeEventListener('mousemove', this.dragMove)
                document.removeEventListener('mouseup', this.dragEnd)
                this.$plain.disabledSelectNone()
            },

            transferValueToLength(value) {
                return this.totalLength * value / this.total
            },
            transferLengthToValue(length) {
                return this.total * length / this.totalLength
            },
        },
    }
</script>