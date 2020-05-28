<template>
    <div class="demo-step">

        <demo-row title="基本用法">
            <demo-line title="当前步骤索引">
                <pl-number v-model="d[1].index"/>
                <pl-checkbox label="纵向" v-model="d[1].vertical"/>
                <pl-checkbox label="迷你尺寸" v-model="d[1].mini"/>
                <pl-checkbox label="标题放在图标下方" v-model="d[1].titleAlignBottom"/>
            </demo-line>
            <demo-line>
                <pl-step-group :current="d[1].index"
                               :vertical="d[1].vertical"
                               :mini="d[1].mini"
                               :titleAlignBottom="d[1].titleAlignBottom"
                               :currentStatus="d[1].index === 5?'finish':null">
                    <pl-step title="获取token" content="调用接口，获取token" @click="$plain.log('获取token')"/>
                    <pl-step title="上传logo" content="使用token上传logo图片" @click="$plain.log('上传logo')"/>
                    <pl-step title="创建卡券" content="调用接口创建卡券信息" @click="$plain.log('创建卡券')"/>
                    <pl-step title="创建二维码" content="调用接口创建二维码" @click="$plain.log('创建二维码')"/>
                    <pl-step title="显示二维码" content="在应用中显示二维码" @click="$plain.log('显示二维码')"/>
                </pl-step-group>
            </demo-line>
        </demo-row>

        <demo-row title="图标">
            <demo-line title="当前步骤索引">
                <pl-number v-model="d[2].index"/>
                <pl-checkbox label="纵向" v-model="d[2].vertical"/>
                <pl-checkbox label="迷你尺寸" v-model="d[2].mini"/>
                <pl-checkbox label="标题放在图标下方" v-model="d[2].titleAlignBottom"/>
            </demo-line>
            <demo-line>
                <pl-step-group :current="d[2].index"
                               :vertical="d[2].vertical"
                               :mini="d[2].mini"
                               :titleAlignBottom="d[2].titleAlignBottom"
                               :currentStatus="d[2].index === 5?'finish':null">
                    <pl-step icon="el-icon-s-promotion" title="获取token" content="调用接口，获取token"/>
                    <pl-step icon="el-icon-upload" title="上传logo" content="使用token上传logo图片"/>
                    <pl-step icon="el-icon-s-ticket" title="创建卡券" content="调用接口创建卡券信息"/>
                    <pl-step icon="el-icon-s-data" title="创建二维码" content="调用接口创建二维码"/>
                    <pl-step icon="el-icon-s-check" title="显示二维码" content="在应用中显示二维码"/>
                </pl-step-group>
            </demo-line>
        </demo-row>

        <demo-row title="小圆点">
            <demo-line title="当前步骤索引">
                <pl-number v-model="d[3].index"/>
                <pl-checkbox label="纵向" v-model="d[3].vertical"/>
                <pl-checkbox label="迷你尺寸" v-model="d[3].mini"/>
                <pl-checkbox label="标题放在图标下方" v-model="d[3].titleAlignBottom"/>
            </demo-line>
            <demo-line>
                <pl-step-group :current="d[3].index"
                               :vertical="d[3].vertical"
                               :mini="d[3].mini"
                               :titleAlignBottom="d[3].titleAlignBottom"
                               dotIcon
                               :currentStatus="d[3].index === 5?'finish':null">
                    <pl-step title="获取token" content="调用接口，获取token"/>
                    <pl-step title="上传logo" content="使用token上传logo图片"/>
                    <pl-step title="创建卡券" content="调用接口创建卡券信息"/>
                    <pl-step title="创建二维码" content="调用接口创建二维码"/>
                    <pl-step title="显示二维码" content="在应用中显示二维码"/>
                </pl-step-group>
            </demo-line>
        </demo-row>
        <demo-row title="状态">
            <demo-line>
                <pl-step-group dotIcon>
                    <pl-step title="Finish" content="This step is finish" status="finish"/>
                    <pl-step title="Process" content="This step is processing..." status="process"/>
                    <pl-step title="error" content="This step is error!" status="error"/>
                    <pl-step title="Wait" content="This step is not start." status="wait"/>
                </pl-step-group>
            </demo-line>
            <demo-line>
                <pl-step-group>
                    <pl-step title="Finish" content="This step is finish" status="finish" icon="el-icon-success"/>
                    <pl-step title="Process" content="This step is processing..." status="process" icon="el-icon-s-tools"/>
                    <pl-step title="error" content="This step is error!" status="error" icon="el-icon-error"/>
                    <pl-step title="Wait" content="This step is not start." status="wait" icon="el-icon-info"/>
                </pl-step-group>
            </demo-line>
            <demo-line>
                <pl-step-group vertical>
                    <pl-step title="Finish" content="This step is finish" status="finish"/>
                    <pl-step title="Process" content="This step is processing..." status="process"/>
                    <pl-step title="error" content="This step is error!" status="error"/>
                    <pl-step title="Wait" content="This step is not start." status="wait"/>
                </pl-step-group>
            </demo-line>
            <demo-line>
                <pl-step-group dotIcon vertical>
                    <pl-step title="Finish" content="This step is finish" status="finish"/>
                    <pl-step title="Process" content="This step is processing..." status="process"/>
                    <pl-step title="error" content="This step is error!" status="error"/>
                    <pl-step title="Wait" content="This step is not start." status="wait"/>
                </pl-step-group>
            </demo-line>
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
            <pl-step-group :current="val[3]" :currentStatus="val[3] === 'step5'?'finish':null">
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

        <demo-row title="自定义标题以及文本内容">
            <demo-line title="当前步骤索引">
                <pl-number v-model="d[4].index"/>
                <pl-checkbox label="纵向" v-model="d[4].vertical"/>
                <pl-checkbox label="迷你尺寸" v-model="d[4].mini"/>
                <pl-checkbox label="标题放在图标下方" v-model="d[4].titleAlignBottom"/>
            </demo-line>
            <demo-line>
                <pl-step-group :current="d[4].index"
                               :vertical="d[4].vertical"
                               :mini="d[4].mini"
                               :titleAlignBottom="d[4].titleAlignBottom"
                               :currentStatus="d[4].index === 5?'finish':null">
                    <pl-step>
                        <span slot="title" v-tooltip="'获取token'">获取token</span>
                        <span slot="content">1、调用接口，获取token</span>
                    </pl-step>

                    <pl-step>
                        <span slot="title" v-tooltip="'上传logo'">上传logo</span>
                        <span slot="content">2、使用token上传logo图片</span>
                    </pl-step>
                    <pl-step>
                        <span slot="title" v-tooltip="'创建卡券'">创建卡券</span>
                        <span slot="content">3、调用接口创建卡券信息</span>
                    </pl-step>
                    <pl-step>
                        <span slot="title" v-tooltip="'创建二维码'">创建二维码</span>
                        <span slot="content">4、调用接口创建二维码</span>
                    </pl-step>
                    <pl-step>
                        <span slot="title" v-tooltip="'显示二维码'">显示二维码</span>
                        <span slot="content">5、在应用中显示二维码</span>
                    </pl-step>
                </pl-step-group>
            </demo-line>
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
                },
                d: {
                    1: {
                        index: 1,
                        vertical: false,
                        mini: false,
                        titleAlignBottom: false,
                    },
                    2: {
                        index: 1,
                        vertical: false,
                        mini: false,
                        titleAlignBottom: false,
                    },
                    3: {
                        index: 1,
                        vertical: false,
                        mini: false,
                        titleAlignBottom: false,
                    },
                    4: {
                        index: 1,
                        vertical: false,
                        mini: false,
                        titleAlignBottom: false,
                    },
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-step {
        width: 1060px;
        margin-left: -130px;

        .demo-line {
            display: flex;

            .demo-line-content {
                flex: 1;
            }
        }
    }
</style>