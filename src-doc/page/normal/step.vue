<template>
    <div class="step">
        <demo-row title="基本用法">
            <demo-line title="当前步骤索引">
                <!--                <pl-toggle v-model="val[0]"/>-->
                <pl-number v-model="val[1]"/>
            </demo-line>
            <pl-step-group v-model="val[1]">
                <pl-step title="获取token" content="调用接口，获取token"/>
                <pl-step title="上传logo" content="使用token上传logo图片"/>
                <pl-step title="创建卡券" v-if="val[0]" content="调用接口创建卡券信息"/>
                <pl-step title="创建二维码" content="调用接口创建二维码"/>
                <pl-step title="显示二维码" content="在应用中显示二维码"/>
            </pl-step-group>
        </demo-row>

        <demo-row title="图标">
            <demo-line title="当前步骤索引">
                <pl-number v-model="val[2]"/>
            </demo-line>
            <pl-step-group v-model="val[2]">
                <pl-step icon="el-icon-s-promotion" title="步骤一"/>
                <pl-step icon="el-icon-s-flag" title="步骤二"/>
                <pl-step icon="el-icon-s-finance" title="步骤三"/>
                <pl-step icon="el-icon-s-platform" title="步骤四"/>
            </pl-step-group>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "step",
        data() {
            return {
                val: {
                    0: true,
                    1: 1,
                }
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>