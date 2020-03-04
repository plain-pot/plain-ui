<template>
    <div class="demo-checkbox">
        <demo-row title="基本用法">
            <pl-checkbox label="是否同意协议" :disabled="disabledFlag"/>
            <pl-checkbox label="disabledFlag" v-model="disabledFlag"/>
            {{disabledFlag}}
        </demo-row>
        <demo-row>
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
    export default {
        name: "demo-checkbox",
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