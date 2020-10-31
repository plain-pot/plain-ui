<template>
    <div class="demo-icon">
        <div style="font-size: 40px;color: #4caf50">
            <span>普通的文本：</span>
            <pl-icon icon="apps-fill"/>
            <svg class="pl-icon icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M288 106.666667A181.333333 181.333333 0 0 1 469.333333 288V469.333333H288a181.333333 181.333333 0 1 1 0-362.666666z m0 448H469.333333v181.333333A181.333333 181.333333 0 1 1 288 554.666667z m448-448a181.333333 181.333333 0 1 1 0 362.666666H554.666667V288a181.333333 181.333333 0 0 1 181.333333-181.333333zM554.666667 554.666667h181.333333A181.333333 181.333333 0 1 1 554.666667 736V554.666667z" /></svg>
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