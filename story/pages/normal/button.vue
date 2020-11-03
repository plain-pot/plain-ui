<template>
    <div class="demo-button">

        <demo-row title="按钮异步文本">
            <pl-button :label="asyncLabel" @click="log(1)"/>
        </demo-row>

    </div>
</template>

<script>

    export default {
        name: "demo-button",
        props: {},
        data() {
            return {
                asyncLabel: new Promise(resolve => setTimeout(() => resolve('异步文本'), 2000)),
                loadingFlag: true,
            }
        },
        methods: {
            async asyncHandler(e) {
                this.$message('async task start')
                await this.$plain.utils.delay(3000)
                if (Math.random() > 0.5) {
                    this.$message.error('async task error')
                    throw new Error('异步任务出错')
                } else {
                    console.log(e)
                    this.$message.success('async task end')
                }
            },
        },
    }
</script>

<style lang="scss">
</style>