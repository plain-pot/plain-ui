<template>
    <div class="demo-ov">
        <im-demo-row title="测试获取选项值服务">
            <pl-button label="获取类型：status" @click="pl_testService"/>
        </im-demo-row>
        <im-demo-row title="下拉框">
            <pl-ov v-model="val[0]" type="status"/>
            [{{val[0]}}]
        </im-demo-row>
        <im-demo-row title="联动选项值">
            <pl-ov v-model="val[1]" type="A"/>
            <pl-ov v-model="val[2]" type="B" parentType="A" :parentCode="val[1]"/>
            <pl-ov v-model="val[3]" type="C" parentType="B" :parentCode="val[2]"/>
            [{{val[1]}}]-[{{val[2]}}]-[{{val[3]}}]-
            <div>
                <pl-button label="set value" @click="val = {1:'A2',2:'B2',3:'C5'}"/>
            </div>
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
