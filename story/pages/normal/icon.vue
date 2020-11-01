<template>
    <div class="demo-icon">
        <div style="font-size: 40px;color: #4caf50">
            <span>普通的文本：NORMAL normal</span>
            <pl-icon icon="el-icon-alarm-clock"/>
            <pl-icon icon="el-icon-arrow-down"/>
        </div>
        <button @click="showFlag = true">
            应用图标
            <pl-icon icon="el-icon-bottom" v-if="showFlag"/>
        </button>
        <h4>自定义图标</h4>
        <pl-icon icon="my-icon-yes"/>

    </div>
</template>

<script>
    export default {
        name: "icon.vue",
        data() {
            return {
                showFlag: false,
            }
        },
    }
</script>

<style lang="scss">

</style>