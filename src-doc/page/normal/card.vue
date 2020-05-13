<template>
    <div class="demo-card">
        <demo-row title="基本用法">
            <pl-card>
                <pl-card-header>卡片标题</pl-card-header>
                <pl-card-content>
                    卡片内容
                </pl-card-content>
            </pl-card>
        </demo-row>
        <demo-row title="图片">
            <pl-card>
                <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="Hamburg" style="width: 100%;height: 100%">
            </pl-card>
        </demo-row>
        <demo-row title="阴影">
            <pl-card shadow="always">
                <pl-card-header>一直存在</pl-card-header>
                <pl-card-content>
                    卡片内容
                </pl-card-content>
            </pl-card>
            <pl-card shadow="hover">
                <pl-card-header>鼠标悬浮存在</pl-card-header>
                <pl-card-content>
                    卡片内容
                </pl-card-content>
            </pl-card>
            <pl-card shadow="never">
                <pl-card-header>永不存在</pl-card-header>
                <pl-card-content>
                    卡片内容
                </pl-card-content>
            </pl-card>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-card"
    }
</script>

<style lang="scss">

</style>