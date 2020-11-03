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
    </div>
</template>

<script>
    export default {
        name: "demo-checkbox",
        data() {
            return {
                disabledFlag: false,
            }
        },
    }
</script>

<style lang="scss">

</style>