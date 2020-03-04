<template>
    <div class="demo-checkbox">
        <demo-row title="基本用法">
            <pl-checkbox label="标签一" v-model="val[0]"/>
            <pl-checkbox label="标签二" v-model="val[0]"/>
            {{val[0]}}
        </demo-row>

        <demo-row title="状态">
            <pl-checkbox v-for="item in status" :label="item" :status="item" :key="item"/>
        </demo-row>

        <demo-row title="禁用">
            <pl-checkbox :value="true" :disabled="val[1]" label="标签一"/>
            <pl-checkbox :value="false" :disabled="val[1]" label="标签二"/>
            <pl-checkbox v-model="val[1]" label="禁用"/>
        </demo-row>

        <demo-row title="真假值">
            <pl-checkbox label="标签一" v-model="val[2]" :trueValue="10" :falseValue="20"/>
            {{val[2]}}
        </demo-row>

        <demo-row title="大小">
            <pl-checkbox label="small" size="small"/>
            <pl-checkbox label="default" size="default"/>
            <pl-checkbox label="large" size="large"/>
            <pl-checkbox label="font-size:24px" style="font-size: 24px"/>
        </demo-row>

        <demo-row title="checkbox-inner">
            <div style="font-size: 12px" class="demo-checkbox-row">
                <pl-checkbox-inner :disabled="disabledFlag"/>
                <pl-checkbox-inner status="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner status="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 14px" class="demo-checkbox-row">
                <pl-checkbox-inner :disabled="disabledFlag"/>
                <pl-checkbox-inner status="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner status="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 16px" class="demo-checkbox-row">
                <pl-checkbox-inner :disabled="disabledFlag"/>
                <pl-checkbox-inner status="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner status="minus" :disabled="disabledFlag"/>
            </div>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "demo-checkbox",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                disabledFlag: false,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-checkbox-row {
        & > * {
            margin-right: 1em;
        }
    }
</style>