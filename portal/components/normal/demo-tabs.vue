<template>
    <div class="demo-tabs">
        <im-demo-row title="基本用法">
            <im-tabs height="200px">
                <im-tab title="用户管理1">
                    demo-tabs 1111
                </im-tab>
                <im-tab title="用户管理2">
                    demo-tabs 2222
                </im-tab>
            </im-tabs>
        </im-demo-row>
        <im-demo-row title="初始化的时候就初始化所有子页签，否则默认为懒初始化，第一次显示的时候才会初始化">
            <im-tabs height="200px">
                <im-tab title="懒初始化：用户管理1">
                    demo-tabs 1111
                    <im-demo-child title="-懒初始化：子组件1-"/>
                </im-tab>
                <im-tab title="懒初始化：用户管理2">
                    demo-tabs 2222
                    <im-demo-child title="-懒初始化：子组件2-"/>
                </im-tab>
                <im-tab title="懒初始化：用户管理3">
                    demo-tabs 3333
                    <im-demo-child title="-懒初始化：子组件3-"/>
                </im-tab>
            </im-tabs>
            <im-tabs initialized height="200px">
                <im-tab title="全初始化：用户管理4">
                    demo-tabs 444
                    <im-demo-child title="-全初始化：子组件4-"/>
                </im-tab>
                <im-tab title="全初始化：用户管理5">
                    demo-tabs 555
                    <im-demo-child title="-全初始化：子组件5-"/>
                </im-tab>
                <im-tab title="全初始化：用户管理6">
                    demo-tabs 666
                    <im-demo-child title="-全初始化：子组件6-"/>
                </im-tab>
            </im-tabs>
        </im-demo-row>

        <im-demo-row title="双向绑定移动页面">
            <im-demo-row>
                <im-button label="后退" @click="index = index-1<0?0:index-1"/>
                <im-button label="前进" @click="index = index+1>2?2:index+1"/>
            </im-demo-row>
            <im-tabs v-model="index" height="200px">
                <im-tab title="用户管理1">
                    demo-tabs 1111
                </im-tab>
                <im-tab title="用户管理2">
                    demo-tabs 2222
                </im-tab>
                <im-tab title="用户管理3">
                    demo-tabs 3333
                </im-tab>
            </im-tabs>
        </im-demo-row>

        <im-demo-row title="特殊页面立即初始化">
            <im-tabs height="200px">
                <im-tab title="用户管理1">
                    demo-tabs 1111
                </im-tab>
                <im-tab title="用户管理2">
                    demo-tabs 2222
                </im-tab>
                <im-tab title="该页立即初始化" initialized>
                    demo-tabs 333
                    <im-demo-child title="立即初始化"/>
                </im-tab>
            </im-tabs>
        </im-demo-row>

        <im-demo-row title="特殊页面隐藏时销毁内容">
            <im-tabs height="200px">
                <im-tab title="用户管理1">
                    demo-tabs 1111
                </im-tab>
                <im-tab title="用户管理2">
                    demo-tabs 2222
                </im-tab>
                <im-tab title="该页面隐藏时销毁" destroyed-on-hide>
                    demo-tabs 333
                    <im-demo-child title="隐藏时销毁"/>
                </im-tab>
            </im-tabs>
        </im-demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-tabs",
        data() {
            return {
                index: 0,
            }
        },
    }
</script>

<style lang="scss">
    .demo-tabs {
    }
</style>