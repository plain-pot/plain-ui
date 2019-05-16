<template>
    <div class="demo-nav-page-2">
        <im-demo-row>
            <im-button label="返回" @click="nav.back()"/>
        </im-demo-row>
        <im-demo-row title="第一页参数">
            <im-button :label="`页面参数:${param.msg}`" type="line"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-2",
        props: {
            nav: {},
            param: {},
        },
    }
</script>

<style lang="scss">

</style>