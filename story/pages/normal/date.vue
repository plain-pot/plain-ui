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