<template>
    <div class="demo-image">
        <demo-row title="pl-image">
            <demo-row title="基本用法">
                <pl-image src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg"/>
            </demo-row>
            <demo-row title="四种状态">
                <pl-image status="empty"/>
                <pl-image status="pending"/>
                <pl-image status="success" src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" height="60" width="60"/>
                <pl-image status="error"/>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-image"
    }
</script>

<style lang="scss">

</style>