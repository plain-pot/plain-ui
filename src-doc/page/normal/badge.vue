<template>
    <div class="demo-badge">
        <demo-row title="基本用法">
            <pl-badge :data="12">
                <pl-button label="消息"/>
            </pl-badge>
        </demo-row>
        <demo-row title="颜色">
            <pl-badge :data="12" status="primary">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" status="warn">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" status="success">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" status="error">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" status="info">
                <pl-button label="消息"/>
            </pl-badge>
        </demo-row>
        <demo-row title="位置">
            <pl-badge :data="12" :bottom="false" :start="true">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" :bottom="false" :start="false">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" :bottom="true" :start="true">
                <pl-button label="消息"/>
            </pl-badge>
            <pl-badge :data="12" :bottom="true" :start="false">
                <pl-button label="消息"/>
            </pl-badge>
        </demo-row>
        <demo-row title="只要小红点">
            <pl-badge dot>
                <pl-button label="消息"/>
            </pl-badge>
        </demo-row>
        <demo-row title="最大值">
            <pl-badge :max="99" :data="200">
                <pl-button label="消息"/>
            </pl-badge>
        </demo-row>
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