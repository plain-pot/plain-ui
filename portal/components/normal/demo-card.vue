<template>
    <div class="demo-card">
        <im-demo-row title="基本用法">
            <im-card>
                <im-card-header>卡片标题</im-card-header>
                <im-card-content>
                    卡片内容
                </im-card-content>
            </im-card>
        </im-demo-row>
        <im-demo-row title="图片">
            <im-card>
                <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="Hamburg" style="width: 100%;height: 100%">
            </im-card>
        </im-demo-row>
        <im-demo-row title="阴影">
            <im-card shadow="always">
                <im-card-header>一直存在</im-card-header>
                <im-card-content>
                    卡片内容
                </im-card-content>
            </im-card>
            <im-card shadow="hover">
                <im-card-header>鼠标悬浮存在</im-card-header>
                <im-card-content>
                    卡片内容
                </im-card-content>
            </im-card>
            <im-card shadow="never">
                <im-card-header>永不存在</im-card-header>
                <im-card-content>
                    卡片内容
                </im-card-content>
            </im-card>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-card"
    }
</script>

<style lang="scss">

</style>