<template>
    <div class="demo-select">
        <im-demo-row title="基本用法">
            <im-select :data="data" labelKey="trainno12306" valueKey="trainno"/>
        </im-demo-row>
    </div>
</template>

<script>
    import {TableData} from "../../data";

    export default {
        name: "demo-select",
        data() {
            return {
                data: [...TableData]
            }
        },
    }
</script>

<style lang="scss">

</style>