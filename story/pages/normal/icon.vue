<template>
    <div class="demo-icon">
        <div style="font-size: 40px;color: #4caf50">
            <span>普通的文本：NORMAL normal</span>
            <pl-icon icon="add-box-fill"/>
            <svg class="pl-icon icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill="#333333"
                      d="M170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m298.666666 341.333333H298.666667v85.333334h170.666666v170.666666h85.333334v-170.666666h170.666666v-85.333334h-170.666666V298.666667h-85.333334v170.666666z"/>
            </svg>
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