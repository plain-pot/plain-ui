<template>
    <div>
        <h1> 重写Date组件</h1>
        <demo-row title="年份">
            <demo-row title="单选">
                <pl-date-panel-year v-model="val[0]"/>
                <pl-date-panel-year v-model="val[0]"/>
                <div>value:{{val[0]}}</div>
            </demo-row>
            <demo-row title="多选">
                <pl-date-panel-year v-model="val[1]" multiple/>
                <pl-date-panel-year v-model="val[1]" multiple/>
                <div>value:{{val[1]}}</div>
            </demo-row>
            <demo-row title="范围选择">
                <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                <div>start:{{val[2]}}</div>
                <div>end:{{val[3]}}</div>
            </demo-row>
            <demo-row title="最大最小值">
                <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range max="2050" min="2021"/>
                <pl-date-panel-year v-model:start="val[2]" v-model:end="val[3]" range/>
                <div>max:2050</div>
                <div>min:2021</div>
                <div>start:{{val[2]}}</div>
                <div>end:{{val[3]}}</div>
            </demo-row>
        </demo-row>
        <demo-row title="年月">
            <demo-row title="单选">
                <pl-date-panel-month v-model="val[4]"/>
                <pl-date-panel-month v-model="val[4]"/>
                <div>{{val[4]}}</div>
            </demo-row>
            <demo-row title="多选">
                <pl-date-panel-month v-model="val[5]" multiple/>
                <pl-date-panel-month v-model="val[5]" multiple/>
                <div>{{val[5]}}</div>
            </demo-row>
            <demo-row title="范围选择">
                <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                <div>start:{{val[6]}}</div>
                <div>end:{{val[7]}}</div>
            </demo-row>
            <demo-row title="最大最小值">
                <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range max="2050-08" min="2021-03"/>
                <pl-date-panel-month v-model:start="val[6]" v-model:end="val[7]" range/>
                <div>max:2050-08</div>
                <div>min:2021-03</div>
                <div>start:{{val[6]}}</div>
                <div>end:{{val[7]}}</div>
            </demo-row>
        </demo-row>
        <demo-row title="日期">
            <demo-row title="单选">
                <pl-date-panel-date v-model="val[8]"/>
                <pl-date-panel-date v-model="val[8]"/>
                <div>value:{{val[8]}}</div>
            </demo-row>
            <demo-row title="多选">
                <pl-date-panel-date v-model="val[9]" multiple/>
                <pl-date-panel-date v-model="val[9]" multiple/>
                <div>value:{{val[9]}}</div>
            </demo-row>
            <demo-row title="日期时间">
                <pl-date-panel-date v-model="val[10]" datetime defaultTime="08:30:00"/>
                <pl-date-panel-date v-model="val[10]" datetime/>
                <div>value:{{val[10]}}</div>
            </demo-row>
            <demo-row title="最大最小值">
                <pl-date-panel-date v-model="val[11]" datetime defaultTime="08:30:00" max="2021-05-05 12:00:00" min="2019-05-05 08:30:15"/>
                <pl-date-panel-date v-model="val[11]" datetime :firstWeekDay="0"/>
                <div>max:2021-05-05 12:00:00</div>
                <div>min:2019-05-05 08:30:15</div>
                <div>value:{{val[11]}}</div>
            </demo-row>
        </demo-row>

        <demo-row title="日期范围">
            <pl-date-panel-range v-model:start="val[12]" v-model:end="val[13]"/>
            <pl-date-panel-range v-model:start="val[12]" v-model:end="val[13]"/>
            <div>start:{{val[11]}}</div>
            <div>end:{{val[12]}}</div>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "date",
        data() {
            return {
                val: {},
            }
        },
    }
</script>

<style lang="scss">

</style>