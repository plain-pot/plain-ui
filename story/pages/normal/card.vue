<template>
    <div class="demo-card">
        <demo-row title="基本用法">
            <pl-card title="卡片标题">

                <template #operator>
                    <pl-button label="更多" mode="text"/>
                </template>

                <div>卡片内容</div>
                <div>卡片内容</div>
                <div>卡片内容</div>
            </pl-card>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "card"
    }
</script>

<style lang="scss">

</style>