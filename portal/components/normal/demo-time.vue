<template>
    <div class="demo-time">
        <im-demo-row :title="`基本用法：${val[0]}`">
            <!--<pl-time-panel v-model="val[0]"/>-->
            <im-time v-model="val[0]"/>
        </im-demo-row>
        <im-demo-row title="测试双向绑定">
            <im-time v-model="val[1]"/>
            <im-time v-model="val[1]"/>
        </im-demo-row>
        <im-demo-row title="最大最小值,max=12:12:12,min=05:05:05">
            <im-time v-model="val[0]" max="12:12:12" min="05:05:05"/>
        </im-demo-row>
        <im-demo-row title="自定义内容">
            <im-time v-model="val[2]">
                <template slot-scope="{value}">
                    <span>{{value}}</span>
                </template>
            </im-time>
        </im-demo-row>
    </div>
</template>

<script>

    export default {
        name: "demo-time",
        data() {
            return {
                val: {
                    1: '12:08:09',
                    2: '12:30:00',
                },
            }
        },
    }
</script>

<style lang="scss">

</style>