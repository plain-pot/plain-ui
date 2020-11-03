<template>
    <div class="demo-checkbox">
        <demo-row title="checkbox-inner">
            <div style="font-size: 12px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 14px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 16px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
        </demo-row>
        <demo-row title="基本用法">
            <pl-checkbox v-model="val[0]" label="复选框文本"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="真假值">
            <pl-checkbox v-model="val[1]" label="复选框文本" trueValue="Y" falseValue="N"/>
            {{val[1]}}
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-checkbox",
        data() {
            return {
                disabledFlag: false,
                val: {},
            }
        },
    }
</script>

<style lang="scss">

</style>