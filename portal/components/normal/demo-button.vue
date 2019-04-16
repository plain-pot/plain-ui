<template>
    <div class="demo-button">
        <im-demo-row title="基本用法">
            <im-button label="按钮"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-button label="按钮" v-for="item in ['primary','success','warn','error','info','disabled']" :label="item" :color="item" :key="item"/>
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