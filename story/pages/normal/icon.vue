<template>
    <div class="demo-icon">
        <div style="font-size: 40px;color: #4caf50">
            <span>普通的文本：</span>
            <pl-icon icon="apps-fill"/>
        </div>
        <button @click="showFlag = true">
            应用图标
            <pl-icon icon="apps-line" v-if="showFlag"/>
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