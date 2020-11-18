<template>
    <div class="demo-tooltip">
        <demo-row title="基本用法">
            <pl-tooltip tooltip="Tooltip文本">
                <span>插槽内容</span>
            </pl-tooltip>
        </demo-row>
        <demo-row title="主题">
            <pl-tooltip tooltip="Tooltip文本" theme="dark">
                <span>DARK</span>
            </pl-tooltip>
            <pl-tooltip tooltip="Tooltip文本" theme="light">
                <span>LIGHT</span>
            </pl-tooltip>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "tooltip"
    }
</script>

<style lang="scss">

</style>