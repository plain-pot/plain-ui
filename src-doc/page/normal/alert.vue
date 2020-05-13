<template>
    <div class="demo-alert">
        <demo-row title="基本用法">
            <pl-alert message="普通信息"/>
            <pl-alert message="普通信息" :icon="null"/>
        </demo-row>
        <demo-row title="状态">
            <pl-alert v-for="item in status" :key="item" :message="item" :status="item"/>
        </demo-row>
        <demo-row title="带标题">
            <pl-alert title="普通" message="普通消息" status="primary"/>
            <pl-alert title="成功" message="成功消息" status="success"/>
            <pl-alert title="警告" message="警告消息" status="warn"/>
            <pl-alert title="失败" message="失败消息" status="error"/>
            <pl-alert title="提示" message="提示消息" status="info"/>
        </demo-row>
        <demo-row title="自定义图标、标题以及内容">
            <pl-alert icon="el-icon-s-opportunity">
                <span slot="title">
                    自定义标题 <pl-button icon="el-icon-right" mode="text" size="mini"/>
                </span>
                <span slot="message">
                    自定义内容 <pl-button label="点击了解更多" mode="text"/>
                </span>
            </pl-alert>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "demo-alert",
        mixins: [DemoMixins],
    }
</script>

<style lang="scss">
    .demo-alert {
        .pl-alert {
            margin-bottom: 8px;
        }
    }
</style>