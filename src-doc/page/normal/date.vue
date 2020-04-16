<template>
    <div class="demo-date">

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
                    {{val[10]}}
                </demo-line>
                <pl-date-base-panel-date v-model="val[10]"/>
                <pl-date-base-panel-date v-model="val[10]" :firstWeekDay="0" max="2021-05-05" min="2019-05-05"/>
            </demo-row>
            <demo-row title="日期时间选择">
                <demo-line>
                    {{val[11]}}
                </demo-line>
                <pl-date-base-panel-date v-model="val[11]" datetime/>
                <pl-date-base-panel-date v-model="val[11]" datetime :firstWeekDay="0" defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-panel-date-range">
            <demo-row title="基本用法">
                <demo-line>
                    <div>start:{{val[12]}}</div>
                    <div>end:{{val[13]}}</div>
                </demo-line>
                <pl-date-panel-date-range :start.sync="val[12]" :end.sync="val[13]"/>
                <pl-date-panel-date-range :start.sync="val[12]" :end.sync="val[13]" max="2021-05-01" min="2018-10-01"/>
            </demo-row>
            <demo-row title="日期时间">
                <demo-line>
                    defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"
                </demo-line>
                <demo-line>
                    <div>start:{{val[14]}}</div>
                    <div>end:{{val[15]}}</div>
                </demo-line>
                <pl-date-panel-date-range :start.sync="val[14]" :end.sync="val[15]" datetime/>
                <pl-date-panel-date-range :start.sync="val[14]" :end.sync="val[15]" datetime defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-date-panel-week">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[16]}}
                </demo-line>
                <pl-date-panel-week v-model="val[16]"/>
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