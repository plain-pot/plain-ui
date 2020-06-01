<template>
    <div class="demo-tab-header">
        <demo-row title="type:text">
            <demo-component position="top"/>
            <demo-component position="bottom"/>
            <demo-component position="top" :moreTabs="true"/>
        </demo-row>
        <demo-row title="type:card">
            <demo-component position="top" type="card"/>
            <demo-component position="bottom" type="card"/>
            <demo-component position="top" type="card" :moreTabs="true"/>
        </demo-row>
        <demo-row title="type:fillet">
            <demo-component position="top" type="fillet"/>
            <demo-component position="bottom" type="fillet"/>
        </demo-row>
    </div>
</template>

<script>

    const DemoComponent = {
        data() {

            let items = this.$attrs.moreTabs ? [
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
                '订单信息', '物理信息', '商品信息', '其他',
            ] : [
                '订单信息', '物理信息', '商品信息', '其他'
            ]
            items = items.map((item, index) => `${item}_${index}`)

            return {
                val: items[0],
                items,
            }
        },
        render(h) {
            return (
                <pl-tab-header {...{props: this.$attrs || {}}} class="demo-component">
                    {
                        this.items.map((item) => (
                            <pl-tab-header-item key={item} active={item === this.val} onClick={() => this.val = item}>
                                {item}
                            </pl-tab-header-item>
                        ))
                    }
                </pl-tab-header>
            )
        },
    }

    export default {
        name: "demo-tab-header",
        components: {DemoComponent},
        data() {
            return {}
        },
    }
</script>

<style lang="scss">
    .demo-tab-header {
        .demo-component {
            margin-bottom: 20px;
        }
    }
</style>