<template>
    <div class="demo-input">
        <im-demo-row title="基本用法">
            <im-input/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-input type="fill"/>
            <im-input type="line"/>
            <im-input type="none"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-input v-for="color in ['primary','success','warn','error','info','disabled']" :key="color" :color="color"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-input size="large"/>
            <im-input size="default"/>
            <im-input size="small"/>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-input shape="round"/>
            <im-input shape="fillet"/>
            <im-input shape="none"/>
        </im-demo-row>
        <im-demo-row title="输入框类型">
            <im-input inputType="password" :value="123456"/>
        </im-demo-row>
        <im-demo-row title="图标">
            <im-input icon="pl-dropdown"/>
        </im-demo-row>
        <im-demo-row title="自定义删除动作">
            <im-input icon="pl-dropdown" @clear="$plain.log('clear')"/>
        </im-demo-row>
        <im-demo-row title="长输入框">
            <im-input long/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-input"
    }
</script>

<style lang="scss">
    .demo-input {
        /*background-color: #3B731D;*/
    }
</style>