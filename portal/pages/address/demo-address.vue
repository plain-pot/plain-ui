<template>
    <div class="demo-address">
        <im-demo-row title="地址选择服务">
            <pl-button label="queryByCodes" @click="queryByCodes"/>
            <pl-button label="queryByParent" @click="queryByParent"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-address",
        methods: {
            async queryByCodes() {
                console.log(await this.$address.queryByCodes(['110000', '110100', '110113', '120103']))
            },
            async queryByParent() {
                console.log(await this.$address.queryByParent(null))
            },
        }
    }
</script>

<style lang="scss">

</style>
