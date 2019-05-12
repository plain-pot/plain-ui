<template>
    <div class="pl-date-range-panel">
        <div class="pl-date-range-panel-left">
            <pl-date-header :pick-year="p_startData.pickYear"
                            :pick-month="p_startData.pickMonth"
                            :view="view"
                            hide-right-button
                            @update:pickYear="p_leftPickYearChange"
                            @update:pickMonth="p_leftPickMonthChange"
                            @changeMode="val=>p_startData.mode = val">
                <pl-time
                        v-if="datetime"
                        :value="p_startData.timeString"
                        arrow
                        animate="scale"
                        slot="time"
                        @input="p_leftTimeChange">
                    <template slot-scope="{value}">
                        <span class="pl-date-time">{{value || '00:00:00'}}</span>
                    </template>
                </pl-time>
            </pl-date-header>
            <pl-date-panel
                    :start-date="p_startData.date"
                    :end-date="p_endData.date"
                    :pick-year="p_startData.pickYear"
                    :pick-month="p_startData.pickMonth"
                    :mode="p_startData.mode"
                    :hover-date.sync="hoverDate"
                    :max-date="maxDate"
                    :min-date="minDate"
                    @pickDate="p_pickDate"
                    @update:pickYear="p_leftPickYearSelect"
                    @update:pickMonth="p_leftPickMonthSelect"/>
        </div>
        <div class="pl-date-range-panel-right">
            <pl-date-header :pick-year="p_endData.pickYear"
                            :pick-month="p_endData.pickMonth"
                            :view="view"
                            hide-left-button
                            @update:pickYear="p_rightPickYearChange"
                            @update:pickMonth="p_rightPickMonthChange"
                            @changeMode="val=>p_endData.mode = val">
                <pl-time
                        v-if="datetime"
                        :value="p_endData.timeString"
                        arrow
                        animate="scale"
                        slot="time"
                        @input="p_rightTimeChange">
                    <template slot-scope="{value}">
                        <span class="pl-date-time">{{value || '00:00:00'}}</span>
                    </template>
                </pl-time>
            </pl-date-header>
            <pl-date-panel
                    :start-date="p_startData.date"
                    :end-date="p_endData.date"
                    :pick-year="p_endData.pickYear"
                    :pick-month="p_endData.pickMonth"
                    :mode="p_endData.mode"
                    :hover-date.sync="hoverDate"
                    :max-date="maxDate"
                    :min-date="minDate"
                    @pickDate="p_pickDate"
                    @update:pickYear="p_rightPickYearSelect"
                    @update:pickMonth="p_rightPickMonthSelect"/>
        </div>
    </div>
</template>

<script>
    import PlDateHeader from "./pl-date-header";
    import PlDatePanel from "./pl-date-panel";
    import PlTime from "../time/pl-time";

    export default {
        name: "pl-date-range-panel",
        components: {PlTime, PlDatePanel, PlDateHeader},
        props: {
            start: {type: String},                                  //开始日期字符串
            end: {type: String},                                    //截止日期字符串

            displayFormat: {type: String,},                         //显示值格式化字符串
            valueFormat: {type: String,},                           //值格式化字符串
            view: {type: String},                                   //视图
            datetime: {type: Boolean},                              //是否选择时间
            maxDate: {},
            minDate: {},
            decodeDateString: {},                                   //解析日期字符串的函数
        },
        watch: {
            start(val) {
                if (this.p_start !== val) {
                    this.p_start = val
                    this.p_reset()
                }
            },
            p_start(val) {
                if (this.start !== val) this.$emit('update:start', val)
            },
            end(val) {
                if (this.p_end !== val) this.p_end = val
            },
            p_end(val) {
                if (this.end !== val) this.$emit('update:end', val)
            },
        },
        data() {
            return {
                p_startData: {
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
                p_endData: {
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

                /*鼠标悬浮的日期*/
                hoverDate: null,
                /*起始时间缓存值*/
                p_start: this.start,
                /*截止时间缓存值*/
                p_end: this.end,
            }
        },
        created() {
            this.p_reset()
        },
        methods: {
            /**
             * 重设选择年份以及月份
             * @author  韦胜健
             * @date    2019/3/8 09:44
             */
            p_reset() {
                this.p_startData = this.decodeDateString(this.p_start)
                this.p_endData = this.decodeDateString(this.p_end)
                if (this.p_startData.month === 11) {
                    this.p_endData.pickYear = this.p_startData.pickYear + 1
                    this.p_endData.pickMonth = 0
                } else {
                    this.p_endData.pickYear = this.p_startData.pickYear
                    this.p_endData.pickMonth = this.p_startData.pickMonth + 1
                }
            },
            /**
             * 处理日期面板选择日期事件
             * @author  韦胜健
             * @date    2019/3/8 09:47
             */
            async p_pickDate(newDate) {
                if (!this.p_startData.date) {
                    this.p_startData.date = newDate
                    return
                }
                if (!this.p_endData.date) {
                    const startTime = this.p_startData.date.getTime()
                    const newTime = newDate.getTime()
                    if (startTime > newTime) {
                        this.p_endData.date = this.p_startData.date
                        this.p_startData.date = newDate
                    } else {
                        this.p_endData.date = newDate
                    }
                    this.p_emitVal()
                    await this.$plain.nextTick()
                    this.$emit('close')
                    return
                }
                this.p_startData.date = newDate
                this.p_endData.date = null
            },

            /**
             * 左侧日期头年份变化处理
             * @author  韦胜健
             * @date    2019/3/8 09:47
             */
            p_leftPickYearChange(val) {
                this.p_startData.pickYear = val
                this.p_endData.pickYear = this.p_startData.pickMonth === 11 ? val + 1 : val
            },
            /**
             * 左侧日期头月份变化处理
             * @author  韦胜健
             * @date    2019/3/8 09:47
             */
            p_leftPickMonthChange(val) {
                this.p_startData.pickMonth = val
                this.p_endData.pickMonth = val === 11 ? 0 : val + 1
                this.p_endData.pickYear = val === 11 ? this.p_startData.pickYear + 1 : this.p_startData.pickYear
            },
            /**
             * 左侧日期面板选择年份处理
             * @author  韦胜健
             * @date    2019/3/8 10:03
             */
            p_leftPickYearSelect(val) {
                this.p_leftPickYearChange(val)
                if (this.view === 'year') {
                    this.p_emitVal()
                    return
                }
                this.p_startData.mode = 'month'
            },
            /**
             * 左侧日期面板选择月份处理
             * @author  韦胜健
             * @date    2019/3/8 10:03
             */
            p_leftPickMonthSelect(val) {
                this.p_leftPickMonthChange(val)
                if (this.view === 'month') {
                    this.p_emitVal()
                    return
                }
                this.p_startData.mode = 'date'
            },
            /**
             * 右侧日期头年份变化处理
             * @author  韦胜健
             * @date    2019/3/8 09:47
             */
            p_rightPickYearChange(val) {
                this.p_endData.pickYear = val
                this.p_startData.pickYear = this.p_startData.pickMonth === 11 ? val - 1 : val
            },
            /**
             * 右侧日期头月份变化处理
             * @author  韦胜健
             * @date    2019/3/8 09:48
             */
            p_rightPickMonthChange(val) {
                this.p_endData.pickMonth = val
                this.p_startData.pickMonth = val === 0 ? 11 : val - 1
                this.p_startData.pickYear = val === 0 ? this.p_endData.pickYear - 1 : this.p_endData.pickYear
            },
            /**
             * 截止日期面板选择年份事件
             * @author  韦胜健
             * @date    2019/3/11 20:37
             */
            p_rightPickYearSelect(val) {
                this.p_rightPickYearChange(val)
                if (this.view === 'year') {
                    this.p_emitVal()
                    return
                }
                this.p_endData.mode = 'month'
            },
            /**
             * 截止日期面板选择月份事件
             * @author  韦胜健
             * @date    2019/3/11 20:37
             */
            p_rightPickMonthSelect(val) {
                this.p_rightPickMonthChange(val)
                if (this.view === 'month') {
                    this.p_emitVal()
                    return
                }
                this.p_endData.mode = 'date'
            },
            /**
             * 开始日期面板时间变化事件
             * @author  韦胜健
             * @date    2019/3/11 20:40
             */
            p_leftTimeChange(timeString) {
                const timeDate = this.$plain.$utils.dateParse(timeString, 'HH:mm:ss')
                const timeDateInfo = this.$plain.$utils.decodeDate(timeDate)
                Object.assign(this.p_startData, {hour: timeDateInfo.hour, minute: timeDateInfo.minute, second: timeDateInfo.second, timeString: timeDateInfo.timeString})
                if (!!this.p_startData.date) {
                    this.p_startData.date.setHours(timeDateInfo.hour)
                    this.p_startData.date.setMinutes(timeDateInfo.minute)
                    this.p_startData.date.setSeconds(timeDateInfo.second)
                    this.p_emitVal()
                }
            },
            /*
             *  description
             *  @author     martsforever
             *  @datetime   2019/3/11 22:02
             */
            p_rightTimeChange(timeString) {
                const timeDate = this.$plain.$utils.dateParse(timeString, 'HH:mm:ss')
                const timeDateInfo = this.$plain.$utils.decodeDate(timeDate)
                Object.assign(this.p_endData, {hour: timeDateInfo.hour, minute: timeDateInfo.minute, second: timeDateInfo.second, timeString: timeDateInfo.timeString})
                if (!!this.p_endData.date) {
                    this.p_endData.date.setHours(timeDateInfo.hour)
                    this.p_endData.date.setMinutes(timeDateInfo.minute)
                    this.p_endData.date.setSeconds(timeDateInfo.second)
                    this.p_emitVal()
                }
            },

            async p_emitVal() {
                this.p_startData.date.setHours(this.p_startData.hour)
                this.p_startData.date.setMinutes(this.p_startData.minute)
                this.p_startData.date.setSeconds(this.p_startData.second)
                if (!!this.maxDate && this.p_startData.date.getTime() > this.maxDate.getTime()) this.p_startData.date.setTime(this.maxDate.getTime())
                if (!!this.minDate && this.p_startData.date.getTime() < this.minDate.getTime()) this.p_startData.date.setTime(this.minDate.getTime())
                this.p_start = this.$plain.$utils.dateFormat(this.p_startData.date, this.valueFormat)

                this.p_endData.date.setHours(this.p_endData.hour)
                this.p_endData.date.setMinutes(this.p_endData.minute)
                this.p_endData.date.setSeconds(this.p_endData.second)
                if (!!this.maxDate && this.p_endData.date.getTime() > this.maxDate.getTime()) this.p_endData.date.setTime(this.maxDate.getTime())
                if (!!this.minDate && this.p_endData.date.getTime() < this.minDate.getTime()) this.p_endData.date.setTime(this.minDate.getTime())
                this.p_end = this.$plain.$utils.dateFormat(this.p_endData.date, this.valueFormat)

                await this.$plain.nextTick()
            },
        }
    }
</script>