<template>
    <div class="demo-tab-header">
        <demo-row title="基本用法">
            <demo-component position="top"/>
            <demo-component position="bottom"/>
        </demo-row>
    </div>
</template>

<script>

    const DemoComponent = {
        data() {
            return {
                val: '订单信息',
                items: [
                    '订单信息', '物理信息', '商品信息', '其他'
                ]
            }
        },
        render(h) {
            return (
                <pl-tab-header {...{props: this.$attrs || {}}} class="demo-component">
                    {
                        this.items.map(item => (
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