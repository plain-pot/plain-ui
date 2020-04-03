<template>
    <div class="step">
        <demo-row title="基本用法">
            <demo-line title="当前步骤索引">
                <pl-number v-model="val[0]"/>
            </demo-line>
            <pl-step-group v-model="val[0]" :currentStatus="val[0] === 5?'finish':null">
                <pl-step title="获取token" content="调用接口，获取token"/>
                <pl-step title="上传logo" content="使用token上传logo图片"/>
                <pl-step title="创建卡券" content="调用接口创建卡券信息"/>
                <pl-step title="创建二维码" content="调用接口创建二维码"/>
                <pl-step title="显示二维码" content="在应用中显示二维码"/>
            </pl-step-group>
        </demo-row>

        <demo-row title="状态">
            <pl-step-group>
                <pl-step title="Finish" content="This step is finish" status="finish"/>
                <pl-step title="Process" content="This step is processing..." status="process"/>
                <pl-step title="error" content="This step is error!" status="error"/>
                <pl-step title="Wait" content="This step is not start." status="wait"/>
            </pl-step-group>
        </demo-row>

        <demo-row title="图标">
            <demo-line title="当前步骤索引">
                <pl-number v-model="val[2]"/>
            </demo-line>
            <pl-step-group v-model="val[2]" :currentStatus="val[2] === 5?'finish':null">
                <pl-step icon="el-icon-s-promotion" title="获取token" content="调用接口，获取token"/>
                <pl-step icon="el-icon-upload" title="上传logo" content="使用token上传logo图片"/>
                <pl-step icon="el-icon-s-ticket" title="创建卡券" content="调用接口创建卡券信息"/>
                <pl-step icon="el-icon-s-data" title="创建二维码" content="调用接口创建二维码"/>
                <pl-step icon="el-icon-s-check" title="显示二维码" content="在应用中显示二维码"/>
            </pl-step-group>
        </demo-row>

        <demo-row title="通过绑定val切换">
            <demo-line title="当前步骤索引">
                <pl-button-group>
                    <pl-button label="step1" @click="val[3] = 'step1'" :active="val[3] === 'step1'"/>
                    <pl-button label="step2" @click="val[3] = 'step2'" :active="val[3] === 'step2'"/>
                    <pl-button label="step3" @click="val[3] = 'step3'" :active="val[3] === 'step3'"/>
                    <pl-button label="step4" @click="val[3] = 'step4'" :active="val[3] === 'step4'"/>
                    <pl-button label="step5" @click="val[3] = 'step5'" :active="val[3] === 'step5'"/>
                </pl-button-group>
            </demo-line>
            <pl-step-group v-model="val[3]" :currentStatus="val[3] === 'step5'?'finish':null">
                <pl-step title="获取token" content="调用接口，获取token" val="step1"/>
                <pl-step title="上传logo" content="使用token上传logo图片" val="step2"/>
                <pl-step title="创建卡券" content="调用接口创建卡券信息" val="step3"/>
                <pl-step title="创建二维码" content="调用接口创建二维码" val="step4"/>
                <pl-step title="显示二维码" content="在应用中显示二维码" val="step5"/>
            </pl-step-group>
            <div style="height: 100px;display: flex;align-items: center;justify-content: center;border: dashed 1px #e1e1e1">
                <h1 v-show="val[3] === 'step1'">Step 1</h1>
                <h1 v-show="val[3] === 'step2'">Step 2</h1>
                <h1 v-show="val[3] === 'step3'">Step 3</h1>
                <h1 v-show="val[3] === 'step4'">Step 4</h1>
                <h1 v-show="val[3] === 'step5'">Step 5</h1>
            </div>
        </demo-row>

        <demo-row title="标题位于图标下方">
            <demo-line title="当前步骤索引">
                <pl-number v-model="val[4]"/>
            </demo-line>
            <pl-step-group titleAlignBottom v-model="val[4]" :currentStatus="val[4] === 5?'finish':null">
                <pl-step title="获取token" content="调用接口，获取token"/>
                <pl-step title="上传logo" content="使用token上传logo图片"/>
                <pl-step title="创建卡券" content="调用接口创建卡券信息"/>
                <pl-step title="创建二维码" content="调用接口创建二维码"/>
                <pl-step title="显示二维码" content="在应用中显示二维码"/>
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
                    0: 1,
                    1: 2,
                    3: 'step1',
                }
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>