<template>
    <div class="demo-ov">
        <im-demo-row title="测试获取选项值服务">
            <pl-button label="获取类型：status" @click="pl_testService"/>
        </im-demo-row>
        <im-demo-row title="下拉框">
            <pl-ov v-model="val[0]" type="status"/>
            [{{val[0]}}]
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-ov",
        data() {
            return {
                val: {
                    0: 'reject'
                },
            }
        },
        methods: {
            async pl_testService() {
                console.log('click222')
                const ret = await this.$ov.getByType('status')
                !!ret && this.$dialog.show(ret.map(item => item.label).join(','))
            },
        }
    }
</script>

<style lang="scss">

</style>
