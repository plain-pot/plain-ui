<template>
    <div class="demo-date">
        <im-demo-row :title="`普通用法，选择日期:${val[0]}`">
            <im-date v-model="val[0]"/>
        </im-demo-row>
        <im-demo-row title="三种视图">
            <im-demo-row-item title="年">
                <im-date v-model="val[1]" view="year"/>
            </im-demo-row-item>
            <im-demo-row-item title="月">
                <im-date v-model="val[2]" view="month"/>
            </im-demo-row-item>
            <im-demo-row-item title="日">
                <im-date v-model="val[3]" view="date"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="三种视图,最大最小值">
            <im-demo-row-item title="年">
                <im-date v-model="val[1]" view="year" max="2020" min="2018"/>
            </im-demo-row-item>
            <im-demo-row-item title="月">
                <im-date v-model="val[2]" view="month" max="2020-05" min="2018-04"/>
            </im-demo-row-item>
            <im-demo-row-item title="日">
                <im-date v-model="val[3]" view="date" max="2020-05-05" min="2018-04-04"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row :title="`值以及显示值格式化:${val[5]}`">
            <im-date v-model="val[5]" valueFormat="YYYYMMDD" displayFormat="YYYY年MM月DD日"/>
        </im-demo-row>
        <im-demo-row :title="`日期范围:${val[6]}-${val[7]}`">
            <im-date :start.sync="val[6]" :end.sync="val[7]" range/>
        </im-demo-row>
        <im-demo-row :title="`日期范围,最大最小值：max=2020-05-05，min=2018-04-04`">
            <im-date :start.sync="val[6]" :end.sync="val[7]" range max="2020-05-05" min="2018-04-04"/>
        </im-demo-row>

        <im-demo-row :title="`日期时间选择:${val[10]}`">
            <im-date v-model="val[10]" datetime/>
        </im-demo-row>
        <im-demo-row :title="`日期范围:${val[11]}-${val[12]}`">
            <im-date :start.sync="val[11]" :end.sync="val[12]" range datetime/>
        </im-demo-row>
        <im-demo-row :title="`日期时间选择:${val[10]}，最大时间：，最小时间`">
            <im-date v-model="val[10]" datetime max="2020-05-05 12:38:38" min="2018-04-04 11:15:16"/>
        </im-demo-row>
        <im-demo-row :title="`日期时间范围选择:${val[10]}，最大时间：，最小时间`">
            <im-date :start.sync="val[11]" :end.sync="val[12]" range datetime max="2020-05-05 12:38:38" min="2018-04-04 11:15:16"/>
        </im-demo-row>
    </div>
</template>

<script>

    export default {
        name: "demo-date",
        data() {
            return {
                val: {
                    0: '2019-03-05',
                    5: '20190306',
                    6: '2019-03-2',
                    7: '2019-03-20',

                    8: null,
                    9: null,

                    10: '2019-05-05 10:09:05',
                    11: '2019-05-05 12:36:35',
                    12: '2019-08-10 11:12:13',
                }
            }
        },
    }
</script>

<style lang="scss">

</style>