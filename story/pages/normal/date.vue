<template>
    <div>
        <h1> 重写Date组件</h1>
        <demo-row title="年份">
            <demo-row title="单选">
                <pl-date-panel-year v-model="val[0]"/>
                <pl-date-panel-year v-model="val[0]"/>
                {{val[0]}}
            </demo-row>
            <demo-row title="多选">
                <pl-date-panel-year v-model="val[1]" multiple/>
                <pl-date-panel-year v-model="val[1]" multiple/>
                {{val[1]}}
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
                <div>start:{{val[2]}}</div>
                <div>end:{{val[3]}}</div>
            </demo-row>
        </demo-row>
        <demo-row title="年月">
            <pl-date-panel-month v-model="val[4]"/>
            <pl-date-panel-month v-model="val[4]"/>
            <div>{{val[4]}}</div>
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