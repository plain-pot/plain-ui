<template>
    <div class="demo-nav-page-1">
        <im-demo-row title="页面一">
            <im-button label="页面二参数：" type="line"/>
            <im-input placeholder v-model="msg"/>
            <im-button label="打开页面二" @click="nav.push({path:'/nav/demo-nav-page-2',param:{msg:msg}})"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-1",
        props: {
            nav: {},
        },
        data() {
            return {
                msg: null,
            }
        },
    }
</script>

<style lang="scss">

</style>