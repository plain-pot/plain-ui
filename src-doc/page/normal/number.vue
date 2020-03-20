<template>
    <div class="demo-number">
        <demo-row title="基本用法">
            <pl-number v-model="val[0]"/>
            <pl-number v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="最大最小值">
            <demo-line title="max:10">
                <pl-number v-model="val[1]" max="10"/>
                {{val[1]}}
            </demo-line>
            <demo-line title="min:1">
                <pl-number v-model="val[2]" min="1"/>
                {{val[2]}}
            </demo-line>
            <demo-line title="max:10,min:1">
                <pl-number v-model="val[3]" max="10" min="1"/>
                {{val[3]}}
            </demo-line>
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