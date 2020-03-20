<template>
    <div class="demo-number">
        <demo-row title="基本用法">
            <pl-number v-model="val[0]"/>
            <pl-number v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "number",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-number {

    }
</style>