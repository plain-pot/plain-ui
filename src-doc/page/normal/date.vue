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