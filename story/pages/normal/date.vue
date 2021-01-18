<template>
    <div>
        <h1> 重写Date组件</h1>
        <demo-row title="年份">
            <pl-date-panel-year v-model="val[0]"/>
            <pl-date-panel-year v-model="val[0]"/>
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