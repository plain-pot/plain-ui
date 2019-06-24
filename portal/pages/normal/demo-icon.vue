<template>
    <div class="demo-icon">
        <im-demo-row title="默认图标">
            <span>默认图标</span>
            <im-icon icon="pad-star"/>
        </im-demo-row>
        <im-demo-row title="自定义扩展图标">
            <im-icon icon="icon-youtubeplay"/>
        </im-demo-row>
        <im-demo-row title="loading">
            <im-icon icon="pl-loading-section-one" loading/>
        </im-demo-row>
        <im-demo-row title="hover样式">
            <span>hover样式</span>
            <im-icon icon="pad-star" hover/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-icon",
        mounted() {
            console.log('icon init');
        },
        beforeDestroy() {
            console.log('icon destroy');
        },
    }
</script>

<style lang="scss">

</style>