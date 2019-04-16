<template>
    <div class="demo-button">
        <im-demo-row title="基本用法">
            <im-button label="按钮"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-button label="按钮" v-for="item in ['primary','success','warn','error','info','disabled']" :label="item" :color="item" :key="item"/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-button label="fill" type="fill"/>
            <im-button label="line" type="line"/>
            <im-button label="none" type="none"/>
        </im-demo-row>
        <im-demo-row title="加载中">
            <im-button label="按钮" loading/>
        </im-demo-row>
        <im-demo-row title="长按钮">
            <im-button label="按钮" long/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-button"
    }
</script>

<style lang="scss">

</style>