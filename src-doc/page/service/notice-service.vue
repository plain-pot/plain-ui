<template>
    <div class="notice-service">
        <demo-row title="基本用法">
            <pl-button label="notice" @click="$notice('保存成功！')"/>
        </demo-row>
        <demo-row title="状态">
            <pl-button v-for="item in status" :key="item" :status="item" :label="item" @click="$notice[item]('正在操作中！')"/>
            <pl-button label="无状态" @click="$notice('正在操作中！',{status:null})"/>
        </demo-row>
        <demo-row title="关闭事件">
            <pl-button label="不自动关闭" @click="$notice('保存成功！',{time:null})"/>
            <pl-button label="1s" @click="$notice('保存成功！',{time:1000})"/>
            <pl-button label="2s" @click="$notice('保存成功！',{time:2000})"/>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "notice-service",
        mixins: [DemoMixins],
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>