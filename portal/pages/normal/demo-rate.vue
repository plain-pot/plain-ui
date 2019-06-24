<template>
    <div class="demo-rate">
        <im-demo-row title="基本用法">
            <im-rate/>
        </im-demo-row>
        <im-demo-row :title="'设置总分为10分：'+val1">
            <im-rate v-model="val1" :total="10"/>
        </im-demo-row>
        <im-demo-row :title="'设置星星显示个数'+val1">
            <im-rate :count="10" :total="10" v-model="val1"/>
        </im-demo-row>
        <im-demo-row title="模式">
            <im-demo-row-item title="普通模式">
                <im-rate mode="normal" :value="2.4"/>
            </im-demo-row-item>
            <im-demo-row-item title="半星模式">
                <im-rate mode="half" :value="2.5"/>
            </im-demo-row-item>
            <im-demo-row-item title="整星模式">
                <im-rate mode="all" :value="2"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-rate v-for="(color,index) in ['primary','success','error','warn','info']" :key="index" :color="color"/>
        </im-demo-row>
        <im-demo-row title="设置激活icon与未激活icon">
            <im-rate active-icon="pad-heart-fill" inactive-icon="pad-heart" color="error" :value="3"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-rate",
        data() {
            return {
                val1: 2.5,
            }
        },
    }
</script>

<style lang="scss">

</style>