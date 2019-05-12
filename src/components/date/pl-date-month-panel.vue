<template>
    <div class="pl-date-month-panel">
        <div class="pl-date-month-panel-content-wrapper">
            <div class="pl-date-month-panel-item-wrapper"
                 v-for="(item,index) in list"
                 @click="p_clickItem(item)"
                 :key="index">
                <div class="pl-date-month-panel-item"
                     :class="{
                        'pl-date-month-panel-item-active':item.active,
                        'pl-date-month-panel-item-pick-month':item.pickMonth,
                        'pl-date-month-panel-item-now':item .now,
                        'pl-date-month-panel-item-disabled':item.disabled,
                     }">
                    <!--{{$amlocale.date.month[item]}}-->
                    {{item.val+1}}月
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ValueMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-date-month-panel",
        mixins: [ValueMixin],
        props: {
            currentMonth: {},
            currentYear: {},
            pickYear: {},
            nowYear: {},                                    //当前年份
            nowMonth: {},                                   //当前月份
            nowDay: {},                                     //当前日
            maxTime: {},
            minTime: {},
            getTime: {type: Function},
        },
        data() {
            return {
                p_watchCurrentValue: false,
            }
        },
        computed: {
            list() {
                const ret = []
                for (let i = 0; i < 12; i++) {
                    const date = new Date(this.pickYear, i+1, 0, 0, 0, 0, 0)
                    const time = this.getTime(date)
                    ret.push({
                        val: i,
                        active: i === this.currentMonth && this.currentYear === this.pickYear,
                        pickMonth: i === this.p_value,
                        now: i === this.nowMonth && this.nowYear === this.pickYear,
                        disabled: (!!this.maxTime && time > this.maxTime) || (!!this.minTime && time < this.minTime),
                    })
                }
                return ret
            },
        },
        methods: {
            p_clickItem(item) {
                if (!!item.disabled) return
                this.p_value = item.val
                this.$emit('input', item.val)
                this.p_emitValue()
            },
        },
    }
</script>