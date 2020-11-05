<template>
    <div class="message-service">
        <demo-row title="基本用法">
            <pl-button label="显示消息" @click="showMsg"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "message-service",
        methods: {
            async showMsg() {
                await this.$message({
                    message: '这个是自定义的消息'
                })
            },
        },
    }
</script>

<style lang="scss">

</style>