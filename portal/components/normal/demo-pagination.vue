<template>
    <div class="demo-pagination">
        <im-demo-row title="基本用法">
            <im-pagination :page="1" :size="20" :total="188" @prev="$message.show('上一页')" @next="$message.show('下一页')" @jump="e=>$message.show('跳转'+e)" @refresh="$message.show('refresh')" @sizeChange="e=>$message.show('sizeChange'+e)"/>
        </im-demo-row>
        <im-demo-row title="自定义页大小选项">
            <im-pagination :page="1" :size="15" :total="188" :size-data="[15,20,30,40,50,60,70]"/>
        </im-demo-row>
        <im-demo-row title="自定义页过多时显示的页数availablePage=1">
            <im-pagination :page="1" :size="20" :total="188" :availablePage="1"/>
        </im-demo-row>
        <im-demo-row title="显示加载状态">
            <im-pagination :page="1" :size="20" :total="188" loading/>
        </im-demo-row>
        <im-demo-row title="固定宽度">
            <im-pagination :page="1" :size="20" :total="180" autoSize/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-pagination"
    }
</script>

<style lang="scss">

</style>