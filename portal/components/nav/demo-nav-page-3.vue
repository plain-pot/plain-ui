<template>
    <div class="demo-nav-page-3">
        <im-demo-row>
            <h2>页面三</h2>
        </im-demo-row>
        <im-demo-row>
            <im-button label="返回" @click="nav.back()"/>
        </im-demo-row>
        <im-demo-row title="上一页参数">
            <im-button :label="`页面参数:${param.msg}`" type="line"/>
        </im-demo-row>

        <im-demo-row title="下一页">
            <im-button label="下一页参数：" type="line"/>
            <im-input placeholder v-model="msg"/>
            <im-button label="打开页面四" @click="nav.push({path:'/nav/demo-nav-page-4',param:{msg:msg}})"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-3",
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