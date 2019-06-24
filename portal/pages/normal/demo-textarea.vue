<template>
    <div class="demo-textarea">
        <im-demo-row title="基本用法">
            <im-textarea v-model="val[0]"/>
            <im-input v-model="val[0]"/>
        </im-demo-row>
        <im-demo-row title="设置宽度">
            <im-textarea width="300px"/>
        </im-demo-row>
        <im-demo-row title="设置cols以及rows">
            <im-textarea :cols="40" :rows="20"/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-textarea type="fill"/>
            <im-textarea type="line"/>
            <im-textarea type="none"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-textarea color="primary"/>
            <im-textarea color="success"/>
            <im-textarea color="warn"/>
            <im-textarea color="error"/>
            <im-textarea color="info"/>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-textarea shape="round"/>
            <im-textarea shape="fillet"/>
            <im-textarea shape="none"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-textarea size="large"/>
            <im-textarea size="default"/>
            <im-textarea size="small"/>
        </im-demo-row>
        <im-demo-row title="禁用">
            <im-textarea disabled/>
        </im-demo-row>
        <im-demo-row title="长输入框">
            <im-textarea long/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-textarea",
        data() {
            return {
                val: {}
            }
        },
    }
</script>

<style lang="scss">

</style>