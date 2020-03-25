<template>
    <div class="notice-service">
        <demo-row title="基本用法">
            <pl-button label="notice" @click="$notice('保存成功！')"/>
        </demo-row>
        <demo-row title="关闭事件">
            <pl-button label="不自动关闭" @click="$notice('保存成功！',{time:null})"/>
            <pl-button label="1s" @click="$notice('保存成功！',{time:1000})"/>
            <pl-button label="2s" @click="$notice('保存成功！',{time:2000})"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "notice-service",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>