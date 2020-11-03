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
            <pl-checkbox label="标签一" v-model="val[0]"/>
            <pl-checkbox label="标签二" v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="状态">
            <pl-checkbox v-for="item in ['primary','success','warn','error','info']" :label="item" :status="item" :key="item" :modelValue="true"/>
        </demo-row>
        <demo-row title="禁用">
            <pl-checkbox :modelValue="true" :disabled="val[1]" label="标签一"/>
            <pl-checkbox :modelValue="false" :disabled="val[1]" label="标签二"/>
            <pl-checkbox v-model="val[1]" label="禁用"/>
        </demo-row>

        <demo-row title="真假值">
            <pl-checkbox label="标签一" v-model="val[2]" :trueValue="10" :falseValue="20"/>
            {{val[2]}}
        </demo-row>

        <demo-row title="大小">
            <pl-checkbox label="mini" size="mini" v-model="val['a']"/>
            <pl-checkbox label="normal" size="normal" v-model="val['a']"/>
            <pl-checkbox label="large" size="large" v-model="val['a']"/>
            <pl-checkbox label="font-size:24px" style="font-size: 24px" v-model="val['a']"/>
        </demo-row>

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
                val: {
                    a: true
                },
            }
        },
    }
</script>

<style lang="scss">

</style>