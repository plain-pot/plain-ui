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
            <pl-date-base-panel-date v-model="val[10]"/>
            <pl-date-base-panel-date v-model="val[10]" :firstWeekDay="0"/>
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
                    10: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>