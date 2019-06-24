<template>
    <div class="demo-nav-page-4">
        <im-demo-row>
            <h2>页面四</h2>
        </im-demo-row>
        <im-demo-row>
            <im-button label="返回" @click="nav.back()"/>
            <im-button label="回退三个页面" @click="nav.back(null,3)"/>
            <im-button label="回退到跟页面" @click="nav.backOff()"/>
        </im-demo-row>
        <im-demo-row title="上一页参数">
            <im-button :label="`页面参数:${param.msg}`" type="line"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-4",
        props: {
            nav: {},
            param: {},
        },
        data() {
            return {
                msg: null
            }
        },

    }
</script>

<style lang="scss">

</style>