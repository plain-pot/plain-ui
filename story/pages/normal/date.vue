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