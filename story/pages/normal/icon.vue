<template>
    <div class="demo-icon">
        <span>普通的文本：</span>
        <pl-icon icon="mianbao"/>
        <button @click="showFlag = true">
            加载饼干图标
            <pl-icon icon="binggan" v-if="showFlag"/>
        </button>
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