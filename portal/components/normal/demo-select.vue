<template>
    <div class="demo-select">
        <im-demo-row title="基本用法">
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno" v-model="val[1]"/>
            <im-button :label="val[1]"/>
        </im-demo-row>
        <im-demo-row title="双向绑定">
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno" v-model="val[1]"/>
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno" v-model="val[1]"/>
        </im-demo-row>
        <im-demo-row title="禁用与只读">
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno" readonly v-model="val[1]"/>
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno" disabled v-model="val[1]"/>
        </im-demo-row>
    </div>
</template>

<script>
    import {TableData} from "../../data";

    export default {
        name: "demo-select",
        data() {
            return {
                data: [...TableData],
                val: {},
            }
        },
    }
</script>

<style lang="scss">

</style>