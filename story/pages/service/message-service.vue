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
            showMsg() {
                this.$message()
            },
        },
    }
</script>

<style lang="scss">

</style>