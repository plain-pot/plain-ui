<template>
    <div class="pl-date-single-panel">
        <pl-date-header :pick-year.sync="p_data.pickYear"
                        :pick-month.sync="p_data.pickMonth"
                        :view="view"
                        @changeMode="val=>p_data.mode = val">
            <pl-time
                    v-if="datetime"
                    :value="p_data.timeString"
                    arrow
                    animate="scale"
                    slot="time"
                    @input="p_timeChange"
                    :max="p_data.maxTimeString"
                    :min="p_data.minTimeString">
                <template slot-scope="{value}">
                    <span class="pl-date-time">{{value || '00:00:00'}}</span>
                </template>
            </pl-time>
        </pl-date-header>
        <pl-date-panel
                :pick-year="p_data.pickYear"
                :pick-month="p_data.pickMonth"
                :mode="p_data.mode"
                :year="p_data.year"
                :month="p_data.month"
                :date="p_data.date"
                :value-date="p_data.date"
                :max-date="maxDate"
                :min-date="minDate"
                :now-year="nowYear"
                :now-month="nowMonth"
                :now-day="nowDay"

                @update:pickYear="p_pickYear"
                @update:pickMonth="p_pickMonth"
                @pickDate="p_pickDate"
        />
    </div>
</template>

<script>
    import PlDatePanel from "./pl-date-panel";
    import PlDateHeader from "./pl-date-header";
    import PlTime from "../time/pl-time";

    export default {
        name: "pl-date-single-panel",
        components: {PlTime, PlDateHeader, PlDatePanel},
        props: {
            value: {},
            displayFormat: {type: String,},
            valueFormat: {type: String,},
            view: {type: String, default: 'date'},
            datetime: {type: Boolean},
            maxDate: {},
            minDate: {},
            nowYear: {},                                    //当前年份
            nowMonth: {},                                   //当前月份
            nowDay: {},                                     //当前日
            decodeDateString: {},                           //解析日期字符串的函数
        },
        watch: {
            value(val) {
                if (this.p_value !== val) {
                    this.p_value = val
                    this.p_reset()
                }
            },
            p_value(val) {
                if (this.value !== val) {
                    this.$emit('input', val)
                    this.p_reset()
                }
            },
        },
        data() {
            return {
                p_data: {
                    pickYear: null,
                    pickMonth: null,

                    year: null,
                    month: null,
                    day: null,

                    hour: null,
                    minute: null,
                    second: null,

                    mode: this.view,

                    date: null,
                    timeString: null,
                },
                p_value: this.value,
            }
        },
        created() {
            this.p_reset()
        },
        methods: {
            p_reset() {
                this.p_data = this.decodeDateString(this.p_value)
            },
            p_pickYear(val) {
                this.p_data.pickYear = val
                if (this.view === 'year') {
                    const newDate = new Date()
                    newDate.setFullYear(val)
                    this.p_value = this.$plain.$utils.dateFormat(newDate, this.valueFormat)
                    this.$emit('close')
                } else {
                    this.p_data.mode = 'month'
                }
            },
            p_pickMonth(val) {
                this.p_data.pickMonth = val
                if (this.view === 'month') {
                    const newDate = new Date()
                    newDate.setFullYear(this.p_data.pickYear)
                    newDate.setMonth(val)
                    this.p_value = this.$plain.$utils.dateFormat(newDate, this.valueFormat)
                    this.$emit('close')
                } else {
                    this.p_data.mode = 'date'
                }
            },
            async p_pickDate(newDate) {
                if (!!this.datetime) {
                    newDate.setHours(this.p_data.hour)
                    newDate.setMinutes(this.p_data.minute)
                    newDate.setSeconds(this.p_data.second)
                }
                if (!!this.maxDate && newDate.getTime() > this.maxDate.getTime()) newDate.setTime(this.maxDate.getTime())
                if (!!this.minDate && newDate.getTime() < this.minDate.getTime()) newDate.setTime(this.minDate.getTime())

                this.p_value = this.$plain.$utils.dateFormat(newDate, this.valueFormat)
                this.$emit('close')
            },
            p_timeChange(timeString) {
                const timeDate = this.$plain.$utils.dateParse(timeString, 'HH:mm:ss')
                const timeDateInfo = this.$plain.$utils.decodeDate(timeDate)
                Object.assign(this.p_data, {hour: timeDateInfo.hour, minute: timeDateInfo.minute, second: timeDateInfo.second, timeString: timeDateInfo.timeString})
                this.p_data.date = this.p_data.date || new Date()
                this.p_data.date.setHours(timeDateInfo.hour)
                this.p_data.date.setMinutes(timeDateInfo.minute)
                this.p_data.date.setSeconds(timeDateInfo.second)
                this.p_value = this.$plain.$utils.dateFormat(this.p_data.date, this.valueFormat)
            },
        }
    }
</script>