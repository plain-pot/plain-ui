<template>
    <div class="demo-date">
        <demo-row title="pl-date-base-panel-year">
            <demo-row title="基本用法">
                <demo-line>
                    val[0]:{{val[0]}}
                </demo-line>
                <pl-date-base-panel-year v-model="val[0]"/>
                <pl-date-base-panel-year v-model="val[0]"/>
            </demo-row>

            <demo-row title="最大最小值">
                <pl-date-base-panel-year max="2030" min="2021"/>
            </demo-row>
            <demo-row title="范围选择">
                <demo-line>
                    <div>start:{{val[1]}}</div>
                    <div>end:{{val[2]}}</div>
                </demo-line>
                <pl-date-base-panel-year range v-model:start="val[1]" v-model:end="val[2]" max="2030" min="2021"/>
                <pl-date-base-panel-year range v-model:start="val[1]" v-model:end="val[2]"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-base-panel-month">
            <demo-row title="基本用法">
                <demo-line>
                    <div>{{val[3]}}</div>
                </demo-line>
                <pl-date-base-panel-month v-model="val[3]"/>
                <pl-date-base-panel-month v-model="val[3]"/>
            </demo-row>
            <demo-row title="最大最小值">
                <demo-line>
                    max="2030-05" min="2018-10"
                </demo-line>
                <demo-line>
                    <div>{{val[4]}}</div>
                </demo-line>
                <pl-date-base-panel-month v-model="val[4]" max="2030-05" min="2018-10"/>
                <pl-date-base-panel-month v-model="val[4]"/>
            </demo-row>
            <demo-row title="范围选择">
                <demo-line>
                    max="2030-05" min="2018-10"
                </demo-line>
                <demo-line>
                    <div>start:{{val[5]}}</div>
                    <div>end:{{val[6]}}</div>
                </demo-line>
                <pl-date-base-panel-month v-model:start="val[5]" v-model:end="val[6]" max="2030-05" min="2018-10" range/>
                <pl-date-base-panel-month v-model:start="val[5]" v-model:end="val[6]" range/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-base-panel-date">
            <demo-row title="基本用法">
                <demo-line>
                    max="2021-05-05" min="2019-05-05"
                </demo-line>
                <demo-line>
                    {{val[10]}}
                </demo-line>
                <pl-date-base-panel-date v-model="val[10]" max="2021-05-05" min="2019-05-05"/>
                <pl-date-base-panel-date v-model="val[10]" :firstWeekDay="0"/>
            </demo-row>
            <demo-row title="日期时间选择">
                <demo-line>
                    max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"
                </demo-line>
                <demo-line>
                    {{val[11]}}
                </demo-line>
                <pl-date-base-panel-date v-model="val[11]" datetime max="2021-05-05 12:00:00" min="2019-05-05 08:30:15" defaultTime="08:30:00"/>
                <pl-date-base-panel-date v-model="val[11]" datetime :firstWeekDay="0"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-panel-date-range">
            <demo-row title="基本用法">
                <demo-line>
                    max="2021-05-01" min="2018-10-01"
                </demo-line>
                <demo-line>
                    <div>start:{{val[12]}}</div>
                    <div>end:{{val[13]}}</div>
                </demo-line>
                <pl-date-panel-date-range v-model:start="val[12]" v-model:end="val[13]" max="2021-05-01" min="2018-10-01"/>
                <pl-date-panel-date-range v-model:start="val[12]" v-model:end="val[13]"/>
            </demo-row>
            <demo-row title="日期时间">
                <demo-line>
                    defaultTime="08:55:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"
                </demo-line>
                <demo-line>
                    <div>start:{{val[14]}}</div>
                    <div>end:{{val[15]}}</div>
                </demo-line>
                <pl-date-panel-date-range datetime v-model:start="val[14]" v-model:end="val[15]"
                                          defaultStartTime="08:55:00"
                                          defaultEndTime="18:30:00"
                                          max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
                <pl-date-panel-date-range v-model:start="val[14]" v-model:end="val[15]" datetime/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-panel-dates">
            <demo-row title="基本用法">
                <demo-line>
                    max="2021-05-09" min="2019-10-07"
                </demo-line>
                <demo-line>
                    {{val[19]}}
                </demo-line>
                <pl-date-panel-dates v-model="val[19]" max="2021-05-09" min="2019-10-07"/>
                <pl-date-panel-dates v-model="val[19]"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-panel-week">
            <demo-row title="基本用法">
                <demo-line>
                    max="2021-05-09" min="2019-10-07"
                </demo-line>
                <demo-line>
                    {{getWeekZhcnString(val[16])}}
                </demo-line>
                <pl-date-panel-week v-model="val[16]"/>
                <pl-date-panel-week v-model="val[16]" max="2021-05-09" min="2019-10-07"/>
            </demo-row>
            <demo-row title="范围选择">
                <demo-line>
                    max="2021-05-09" min="2019-10-07"
                </demo-line>
                <demo-line>
                    <div>start:{{getWeekZhcnString(val[17])}}</div>
                    <div>end:{{getWeekZhcnString(val[18])}}</div>
                </demo-line>
                <pl-date-panel-week v-model:start="val[17]" v-model:end="val[18]" range/>
                <pl-date-panel-week v-model:start="val[17]" v-model:end="val[18]" range max="2021-05-09" min="2019-10-07"/>
            </demo-row>
        </demo-row>

    </div>
</template>

<script>
    import {WeekUtils} from "../../../src/packages/date/date.utils";

    export default {
        name: "date",
        data() {
            return {
                getWeekZhcnString: WeekUtils.getWeekZhcnString,
                val: {},
            }
        },
    }
</script>

<style lang="scss">

</style>