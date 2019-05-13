<template>
    <div class="demo-badge">
        <im-demo-row title="基本用法">
            <im-badge :data="12">
                <im-button label="消息"/>
            </im-badge>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-badge :data="12" color="primary">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" color="warn">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" color="success">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" color="error">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" color="info">
                <im-button label="消息"/>
            </im-badge>
        </im-demo-row>
        <im-demo-row title="位置">
            <im-badge :data="12" :bottom="false" :start="true">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" :bottom="false" :start="false">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" :bottom="true" :start="true">
                <im-button label="消息"/>
            </im-badge>
            <im-badge :data="12" :bottom="true" :start="false">
                <im-button label="消息"/>
            </im-badge>
        </im-demo-row>
        <im-demo-row title="只要小红点">
            <im-badge dot>
                <im-button label="消息"/>
            </im-badge>
        </im-demo-row>
        <im-demo-row title="最大值">
            <im-badge :max="99" :data="200">
                <im-button label="消息"/>
            </im-badge>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-badge"
    }
</script>

<style lang="scss">
    .demo-badge {

    }
</style>