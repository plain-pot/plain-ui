<template>
    <div class="pl-date-panel">
        <div class="pl-date-panel-body">
            <pl-date-year-panel :value="pickYear"
                                :current-year="year"
                                :now-year="nowYear"
                                :max-date="maxDate"
                                :min-date="minDate"
                                @input="p_changePickYear"
                                v-if="mode === 'year'"/>
            <pl-date-month-panel :value="pickMonth"
                                 :current-month="month"
                                 :current-year="year"
                                 :pick-year="p_pickYear"
                                 :now-year="nowYear"
                                 :now-month="nowMonth"
                                 :now-day="nowDay"
                                 :max-time="maxTime"
                                 :min-time="minTime"
                                 :get-time="p_getTime"
                                 @input="p_changePickMonth"
                                 v-else-if="mode === 'month'"/>
            <pl-date-day-panel
                    v-else
                    :year="p_pickYear"
                    :month="p_pickMonth"
                    :current-date="valueDate"
                    :start-date="startDate"
                    :end-date="endDate"
                    :hover-date.sync="p_hoverDate"
                    :max-time="maxTime"
                    :min-time="minTime"
                    :get-time="p_getTime"

                    @pickDate="p_pickDate"/>
        </div>
    </div>
</template>

<script>
    import PlDateDayPanel from "./pl-date-day-panel";
    import PlDateYearPanel from "./pl-date-year-panel";
    import PlDateMonthPanel from "./pl-date-month-panel";

    export default {
        name: "pl-date-panel",
        components: {PlDateMonthPanel, PlDateYearPanel, PlDateDayPanel},
        props: {
            pickYear: {},                                   //当前选择面板的年份
            pickMonth: {},                                  //当前选择面板的月份
            mode: {},                                       //当前显示的模式
            year: {},                                       //当前值的年份
            month: {},                                      //当前值的月份
            date: {},                                       //当前值的日期
            valueDate: {},                                  //当前日期的时间Date对象
            startDate: {},                                  //开始时间日期
            endDate: {},                                    //截止时间日期
            hoverDate: {},                                  //鼠标浮动所处的日期
            maxDate: {},                                    //最大可选日期
            minDate: {},                                    //最小可选日期
            nowYear: {},                                    //当前年份
            nowMonth: {},                                   //当前月份
            nowDay: {},                                     //当前日
        },
        watch: {
            pickYear(val) {
                if (this.p_pickYear !== val) this.p_pickYear = val
            },
            pickMonth(val) {
                if (this.p_pickMonth !== val) this.p_pickMonth = val
            },
            hoverDate(val) {
                if (this.p_hoverDate !== val) this.p_hoverDate = val
            },
            p_hoverDate(val) {
                if (this.hoverDate !== val) this.$emit('update:hoverDate', val)
            },
        },
        data() {
            const tempDate = new Date(new Date().getFullYear(), 0, 0, 0, 0, 0, 0)
            return {
                tempDate,
                p_pickYear: this.pickYear,
                p_pickMonth: this.pickMonth,
                p_hoverDate: this.hoverDate,
            }
        },
        computed: {
            /*@formatter:off*/
            /*最大日期的time*/
            maxTime() {return !!this.maxDate?this.p_getTime(this.maxDate):null},
            /*最小日期的time*/
            minTime() {return !!this.minDate?this.p_getTime(this.minDate):null},
            /*@formatter:on*/
        },
        methods: {
            p_changePickYear(val) {
                this.p_pickYear = val
                this.$emit('update:pickYear', val)
            },
            p_changePickMonth(val) {
                this.p_pickMonth = val
                this.$emit('update:pickMonth', val)
            },
            p_pickDate({year, month, day}) {
                this.$emit('pickDate', new Date(year, month, day))
            },
            /*
                *  获取日期对应的time
                *  @author     martsforever
                *  @datetime   2019/3/3 21:15
                */
            p_getTime(date) {
                if (!date) return null
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDate()
                return `${this.$plain.$utils.zeroize(year)}${this.$plain.$utils.zeroize(month)}${this.$plain.$utils.zeroize(day)}` - 0
            },
        },
    }
</script>