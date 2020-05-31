<template>
    <div class="demo-tab-header">
        <demo-row title="基本用法">
            <pl-tab-header>
                <pl-tab-header-item v-for="item in ['订单信息','物理信息','商品信息','其他']" :key="item" :active="val[0] === item" @click="val[0] = item">
                    {{item}}
                </pl-tab-header-item>
            </pl-tab-header>
        </demo-row>

        <demo-row title="位置">
            <demo-line title="position=top">
                <pl-tab-header position="top">
                    <pl-tab-header-item active>订单信息</pl-tab-header-item>
                    <pl-tab-header-item>物理信息</pl-tab-header-item>
                    <pl-tab-header-item>商品信息</pl-tab-header-item>
                    <pl-tab-header-item>其他</pl-tab-header-item>
                </pl-tab-header>
            </demo-line>
            <demo-line title="position-bottom">
                <pl-tab-header position="bottom">
                    <pl-tab-header-item active>订单信息</pl-tab-header-item>
                    <pl-tab-header-item>物理信息</pl-tab-header-item>
                    <pl-tab-header-item>商品信息</pl-tab-header-item>
                    <pl-tab-header-item>其他</pl-tab-header-item>
                </pl-tab-header>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tab-header",
        data() {
            return {
                val: {
                    0: '订单信息',
                }
            }
        },
    }
</script>

<style lang="scss">

</style>