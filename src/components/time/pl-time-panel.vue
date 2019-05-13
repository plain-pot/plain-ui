<template>
    <div class="pl-time-panel">
        <div class="pl-time-panel-label-wrapper">
            <div class="pl-time-panel-label" @click.stop="$emit('clickLabel')">
                <span>{{timeString}}</span>
            </div>
        </div>
        <div class="pl-time-spin-wrapper">
            <pl-time-spin :num="24" :width="width" :value="hour" @input="p_hourInput" :max="p_max.hour" :min="p_min.hour"/>
            <pl-time-spin :num="60" :width="width" :value="minute" @input="p_minuteInput" :max="p_maxMinute" :min="p_minMinute"/>
            <pl-time-spin :num="60" :width="width" v-model="second" @input="p_emitVal" :max="p_maxSecond" :min="p_minSecond"/>
        </div>
    </div>
</template>

<script>
    import PlTimeSpin from "./pl-time-spin";

    export default {
        name: "pl-time-panel",
        components: {PlTimeSpin},
        props: {
            value: {type: String,},
            width: {default: 50},
            defaultValue: {type: String, default: '08:00:00'},
            max: {},
            min: {},
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    Object.assign(this, this.p_formatString(!val ? this.defaultValue : val))
                },
            },
            max: {
                immediate: true,
                handler(val) {
                    Object.assign(this.p_max, this.p_formatString(val))
                },
            },
            min: {
                immediate: true,
                handler(val) {
                    Object.assign(this.p_min, this.p_formatString(val))
                },
            },
        },
        data() {
            return {
                hour: 0,
                minute: 0,
                second: 0,

                p_max: {
                    hour: null,
                    minute: null,
                    second: null,
                },

                p_min: {
                    hour: null,
                    minute: null,
                    second: null,
                },

            }
        },
        computed: {
            timeString() {
                return `${this.$plain.$utils.zeroize(this.hour)}:${this.$plain.$utils.zeroize(this.minute)}:${this.$plain.$utils.zeroize(this.second)}`
            },
            p_maxMinute() {
                return this.hour !== this.p_max.hour ? null : this.p_max.minute
            },
            p_minMinute() {
                return this.hour !== this.p_min.hour ? null : this.p_min.minute
            },
            p_maxSecond() {
                return this.hour === this.p_max.hour && this.minute === this.p_max.minute ? this.p_max.second : null
            },
            p_minSecond() {
                return this.hour === this.p_min.hour && this.minute === this.p_min.minute ? this.p_min.second : null
            },
        },
        methods: {
            async p_hourInput(val) {
                await this.$plain.nextTick()
                if (val >= this.p_max.hour && this.p_max.hour != null) {
                    this.hour = this.p_max.hour
                    this.minute = this.p_max.minute
                    this.second = this.p_max.second
                } else if (val <= this.p_min.hour && this.p_min.hour != null) {
                    this.hour = this.p_min.hour
                    this.minute = this.p_min.minute
                    this.second = this.p_min.second
                } else {
                    this.hour = val
                }
                this.p_emitVal()
            },
            async p_minuteInput(val) {
                await this.$plain.nextTick()
                if (this.hour === this.p_max.hour && val >= this.p_max.minute && this.p_max.minute != null) {
                    this.minute = this.p_max.minute
                    this.second = this.p_max.second
                } else if (this.hour === this.p_min.hour && val <= this.p_min.minute && this.p_min.minute != null) {
                    this.minute = this.p_min.minute
                    this.second = this.p_min.second
                } else {
                    this.minute = val
                }
                this.p_emitVal()
            },
            p_formatString(val) {
                if (!val) return {hour: null, minute: null, second: null}
                const [hour, minute, second] = val.split(":").map(item => item - 0)
                return {hour, minute, second}
            },
            p_emitVal() {
                this.$emit('input', this.timeString)
            },
        }
    }
</script>