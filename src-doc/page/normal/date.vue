<template>
    <div class="demo-date">

        <demo-row title="date panels">
            <demo-row title="pl-date-base-panel-year">
                <demo-row title="基本用法">
                    <pl-date-base-panel-year v-model="val[0]"/>
                    <pl-date-base-panel-year v-model="val[0]"/>
                </demo-row>

                <demo-row title="最大最小值">
                    <pl-date-base-panel-year :max="2030" :min="2021"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        <div>start:{{val[1]}}</div>
                        <div>end:{{val[2]}}</div>
                    </demo-line>
                    <pl-date-base-panel-year range :start.sync="val[1]" :end.sync="val[2]" :max="2030" :min="2021"/>
                    <pl-date-base-panel-year range :start.sync="val[1]" :end.sync="val[2]"/>
                </demo-row>
            </demo-row>

            <demo-row title="pl-date-base-panel-month">
                <demo-row title="基本用法">
                    <demo-line>
                        <div>{{val[3]}}</div>
                    </demo-line>
                    <pl-date-base-panel-month v-model="val[3]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
                    <pl-date-base-panel-month v-model="val[3]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
                </demo-row>
                <demo-row title="最大最小值">
                    <demo-line>
                        max="2030-05-01" min="2018-10-1"
                    </demo-line>
                    <demo-line>
                        <div>{{val[4]}}</div>
                    </demo-line>
                    <pl-date-base-panel-month v-model="val[4]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD" max="2030-05-01" min="2018-10-01"/>
                    <pl-date-base-panel-month v-model="val[4]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2030-05-01" min="2018-10-1"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[5]}}</div>
                        <div>end:{{val[6]}}</div>
                    </demo-line>
                    <pl-date-base-panel-month :start.sync="val[5]" :end.sync="val[6]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD" max="2030-05-01" min="2018-10-01" range/>
                    <pl-date-base-panel-month :start.sync="val[5]" :end.sync="val[6]" displayFormat="YYYY-MM-DD" valueFormat="YYYY-MM-DD" range/>
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
                    <pl-date-panel-date-range :start.sync="val[12]" :end.sync="val[13]" max="2021-05-01" min="2018-10-01"/>
                    <pl-date-panel-date-range :start.sync="val[12]" :end.sync="val[13]"/>
                </demo-row>
                <demo-row title="日期时间">
                    <demo-line>
                        defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[14]}}</div>
                        <div>end:{{val[15]}}</div>
                    </demo-line>
                    <pl-date-panel-date-range :start.sync="val[14]" :end.sync="val[15]" datetime defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
                    <!--                <pl-date-panel-date-range :start.sync="val[14]" :end.sync="val[15]" datetime/>-->
                </demo-row>
            </demo-row>

            <demo-row title="pl-date-panel-week">
                <demo-row title="基本用法">
                    <demo-line>
                        max="2021-05-09" min="2019-10-07"
                    </demo-line>
                    <demo-line>
                        {{val[16]}}
                    </demo-line>
                    <pl-date-panel-week v-model="val[16]"/>
                    <pl-date-panel-week v-model="val[16]" max="2021-05-09" min="2019-10-07"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2021-05-09" min="2019-10-07"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[17]}}</div>
                        <div>end:{{val[18]}}</div>
                    </demo-line>
                    <pl-date-panel-week :start.sync="val[17]" :end.sync="val[18]" range/>
                    <pl-date-panel-week :start.sync="val[17]" :end.sync="val[18]" range max="2021-05-09" min="2019-10-07"/>
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
        </demo-row>

        <demo-row title="pl-date-panel">
            <demo-row title="year">
                <demo-row title="基本用法">
                    <demo-line>
                        :max="2030" :min="2021"
                    </demo-line>
                    <demo-line>
                        {{val[20]}}
                    </demo-line>
                    <pl-date-panel v-model="val[20]" panel="year" :max="2030" :min="2021"/>
                    <pl-date-panel v-model="val[20]" panel="year"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        :max="2030" :min="2021"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[21]}}</div>
                        <div>end:{{val[22]}}</div>
                    </demo-line>
                    <pl-date-panel range :start.sync="val[21]" :end.sync="val[22]" panel="year" :max="2030" :min="2021"/>
                    <pl-date-panel range :start.sync="val[21]" :end.sync="val[22]" panel="year"/>
                </demo-row>
            </demo-row>
            <demo-row title="year-month">
                <demo-row title="基本用法">
                    <demo-line>
                        max="2030-05" min="2020-08"
                    </demo-line>
                    <demo-line>
                        {{val[23]}}
                    </demo-line>
                    <pl-date-panel v-model="val[23]" panel="month" max="2030-05" min="2020-08"/>
                    <pl-date-panel v-model="val[23]" panel="month"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2030-05" min="2020-08"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[24]}}</div>
                        <div>end:{{val[25]}}</div>
                    </demo-line>
                    <pl-date-panel range :start.sync="val[24]" :end.sync="val[25]" panel="month" max="2030-05" min="2020-08"/>
                    <pl-date-panel range :start.sync="val[24]" :end.sync="val[25]" panel="month"/>
                </demo-row>
            </demo-row>
            <demo-row title="date">
                <demo-row title="基本用法">
                    <demo-line>
                        max="2030-05-05" min="2020-01-01"
                    </demo-line>
                    <demo-line>
                        {{val[26]}}
                    </demo-line>
                    <pl-date-panel v-model="val[26]" panel="date" max="2030-05-05" min="2020-01-01"/>
                    <pl-date-panel v-model="val[26]" panel="date"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2030-05-05" min="2020-01-01"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[27]}}</div>
                        <div>end:{{val[28]}}</div>
                    </demo-line>
                    <pl-date-panel range :start.sync="val[27]" :end.sync="val[28]" panel="date" max="2030-05-05" min="2020-01-01"/>
                    <pl-date-panel range :start.sync="val[27]" :end.sync="val[28]" panel="date"/>
                </demo-row>
            </demo-row>
            <demo-row title="datetime">
                <demo-row title="基本用法">
                    <demo-line>
                        max="2030-05-05 13:00:00" min="2020-01-01 08:30:15"
                    </demo-line>
                    <demo-line>
                        {{val[29]}}
                    </demo-line>
                    <pl-date-panel v-model="val[29]" panel="datetime" max="2030-05-05 13:00:00" min="2020-01-01 08:30:15"/>
                    <pl-date-panel v-model="val[29]" panel="datetime"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2030-05-05 13:00:00" min="2020-01-01 08:30:15"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[30]}}</div>
                        <div>end:{{val[31]}}</div>
                    </demo-line>
                    <pl-date-panel range :start.sync="val[30]" :end.sync="val[31]" panel="datetime" max="2030-05-05 13:00:00" min="2020-01-01 08:30:15" defaultTime="08:30:00"/>
                    <pl-date-panel range :start.sync="val[30]" :end.sync="val[31]" panel="datetime"/>
                </demo-row>
            </demo-row>

            <demo-row title="week">
                <demo-row title="基本用法">
                    <demo-line>
                        max="2021-05-09" min="2019-10-07"
                    </demo-line>
                    <demo-line>
                        {{val[32]}}
                    </demo-line>
                    <pl-date-panel v-model="val[32]" panel="week" max="2021-05-09" min="2019-10-07"/>
                    <pl-date-panel v-model="val[32]" panel="week" :firstWeekDay="0"/>
                </demo-row>
                <demo-row title="范围选择">
                    <demo-line>
                        max="2021-05-09" min="2019-10-07"
                    </demo-line>
                    <demo-line>
                        <div>start:{{val[33]}}</div>
                        <div>end:{{val[34]}}</div>
                    </demo-line>
                    <pl-date-panel range :start.sync="val[33]" :end.sync="val[34]" panel="week" max="2021-05-09" min="2019-10-07"/>
                    <pl-date-panel range :start.sync="val[33]" :end.sync="val[34]" panel="week" :firstWeekDay="0"/>
                </demo-row>
            </demo-row>

            <demo-row title="dates">
                <demo-line>
                    max="2021-05-09" min="2019-10-07"
                </demo-line>
                <demo-line>
                    {{val[35]}}
                </demo-line>
                <pl-date-panel panel="dates" v-model="val[35]" max="2021-05-09" min="2019-10-07"/>
                <pl-date-panel panel="dates" v-model="val[35]"/>
            </demo-row>

        </demo-row>

        <!--<demo-row title="基本用法">
            <pl-date/>
        </demo-row>-->
    </div>
</template>

<script>
    export default {
        name: "date",
        props: {},
        data() {
            return {
                val: {
                    10: null,
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>