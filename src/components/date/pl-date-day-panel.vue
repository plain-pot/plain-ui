<template>
    <div class="pl-date-day-panel" @mouseleave="p_leavePanel">
        <div class="pl-date-day-panel-item-wrapper pl-date-day-panel-item-wrapper-title"
             v-for="(weekName,index) in weekNames"
             :key="`_${index}`">
            <div class="pl-date-day-panel-item">
                <div class="pl-date-day-panel-item-inner">
                    <span class="pl-date-day-panel-item-label">{{weekName}}</span>
                </div>
            </div>
        </div>
        <div class="pl-date-day-panel-item-wrapper"
             v-for="(item,index) in days"
             :key="index"
             @click.stop="p_clickItem(item)"
             @mouseenter="p_hoverItem(item)">
            <div class="pl-date-day-panel-item"
                 :class="{
                    'pl-date-day-panel-item-today':item.isToday,
                    'pl-date-day-panel-item-other-month':item.isOtherMonth,
                    'pl-date-day-panel-item-active':item.active,
                    'pl-date-day-panel-item-disabled':item.disabled,
                    'pl-date-day-panel-item-light':p_isLight(item)}">
                <div class="pl-date-day-panel-item-inner">
                    <span class="pl-date-day-panel-item-label">{{item.isToday?'今':item.day}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-date-day-panel",
        props: {
            year: {},                                   //当前面板显示的年份
            month: {},                                  //当前面板显示的月份
            currentDate: {},                            //当前日期
            startDate: {},                              //日期范围开始日期
            endDate: {},                                //日期范围结束日期
            hoverDate: {},                              //当前鼠标浮动的日期
            maxTime: {},                                //最大时间戳
            minTime: {},                                //最小时间戳
            getTime: {},                                //获取时间戳函数
        },
        data() {
            const now = new Date()
            const nowYear = now.getFullYear()
            const nowMonth = now.getMonth()
            const nowDay = now.getDate()


            return {
                weekNames: ['日', '1', '二', '三', '四', '五', '六'],
                now,
                nowYear,
                nowMonth,
                nowDay,
            }
        },
        computed: {
            /*@formatter:off*/

            /*当前选择年份*/
            selectYear() {return this.year != null ? this.year : new Date().getFullYear()},
            /*当前选择月份*/
            selectMonth() {return this.month != null ? this.month : new Date().getMonth()},

            hoverTime() {
                if (!this.hoverDate) return null
                return this.hoverDate.getTime()
            },
            startTime() {
                if (!this.startDate) return null
                const date = this.$plain.$utils.deepCopy(this.startDate)
                date.setHours(0)
                date.setMinutes(0)
                date.setSeconds(0)
                return this.getTime(date)
            },
            endTime() {
                if (!this.endDate) return null
                const date = this.$plain.$utils.deepCopy(this.endDate)
                date.setHours(0)
                date.setMinutes(0)
                date.setSeconds(0)
                return this.getTime(date)
            },
            /*@formatter:on*/

            days() {
                let days = []
                let date = new Date()
                let month = this.selectMonth                                //当前显示日历版的月份
                date.setFullYear(this.selectYear, month, 1)                 //当前日历版的年月时间

                /*---------------------------------------添加目标月上个月日期-------------------------------------------*/
                let week = date.getDay()                                    //目标月的第一天是星期几
                date.setDate(0)                                             //设置时间为目标月上个月的最后一天
                let day = date.getDate()
                while (week > 0) {                                          //添加上个月的最后几天
                    date.setDate(day)
                    days.unshift(this.newPushDate(date))
                    day--
                    week--
                }
                /*---------------------------------------添加目标月日期-------------------------------------------*/
                date.setFullYear(this.selectYear, month + 1, 1)             //设置日期为目标月的下一月，1号
                date.setDate(0)                                             //设置日期为目标月最后一天
                day = date.getDate()                                        //目标月最后一天
                for (let i = 1; i <= day; i++) {                            //添加目标月日期
                    date.setDate(i)
                    days.push(this.newPushDate(date))
                }
                /*---------------------------------------添加目标月下个月日期-------------------------------------------*/
                date.setFullYear(this.selectYear, month + 1, 1)             //设置日期为目标月的下一月，1号
                for (let i = 1; days.length < 42; i++) {
                    date.setDate(i)
                    days.push(this.newPushDate(date))
                }
                return days
            },
        },
        methods: {
            /*
             *  获取要渲染的日期数据对象
             *  @author     martsforever
             *  @datetime   2019/3/3 21:13
             */
            newPushDate(date) {
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDate()
                const isToday = (year === this.nowYear) && (month === this.nowMonth) && (day === this.nowDay)
                const time = this.getTime(date)
                return {
                    year,
                    month,
                    day,
                    time,
                    disabled: (!!this.maxTime && time > this.maxTime) || (!!this.minTime && time < this.minTime),
                    /*日期是否为今天*/
                    isToday,
                    /*日期是否为选择月份的日期*/
                    isOtherMonth: month !== this.selectMonth,
                    active: this.isThatDate(this.currentDate, {year, month, day}) || this.isThatDate(this.startDate, {year, month, day}) || this.isThatDate(this.endDate, {year, month, day}),
                }
            },
            /*
             *  判断是否为当天
             *  @author     martsforever
             *  @datetime   2019/3/3 21:13
             */
            isThatDate(date, {year, month, day}) {
                if (!date) return false
                return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
            },
            /*
             *  处理日期dom鼠标hover事件
             *  @author     martsforever
             *  @datetime   2019/3/3 21:14
             */
            p_hoverItem(item) {
                this.$emit('update:hoverDate', new Date(item.year, item.month, item.day, 0, 0, 0))
            },
            /*
             *  处理鼠标离开日期面板事件
             *  @author     martsforever
             *  @datetime   2019/3/3 21:15
             */
            p_leavePanel() {
                this.$emit('update:hoverDate', null)
            },
            /*
             *  日期dom是否应该高亮
             *  @author     martsforever
             *  @datetime   2019/3/3 21:15
             */
            p_isLight(pushDate) {
                if (!this.startTime) return false
                if (!!this.endTime) return pushDate.time >= this.startTime && pushDate.time <= this.endTime
                return !!this.hoverTime && pushDate.time >= Math.min(this.hoverTime, this.startTime) && pushDate.time <= Math.max(this.hoverTime, this.startTime)
            },
            /*
             *  处理日期点击事件
             *  @author     martsforever
             *  @datetime   2019/3/6 21:07
             */
            p_clickItem(item) {
                if (!!item.disabled) return
                this.$emit('pickDate', item)
            },
        },
    }
</script>