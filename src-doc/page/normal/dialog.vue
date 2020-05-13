<template>
    <div class="demo-dialog">
        <demo-row title="基本用法">
            <pl-button label="open dialog" @click="val[0] = true"/>
            <pl-dialog v-model="val[0]">
                Hello World
            </pl-dialog>
            <span>text</span>
        </demo-row>
        <demo-row title="大小">
            <pl-button label="宽高" @click="val[1] = true"/>
            <pl-dialog v-model="val[1]" width="400" height="600px">
                {{str}}
            </pl-dialog>
            <pl-button label="最小宽高" @click="val[2] = true"/>
            <pl-dialog v-model="val[2]" minWidth="300" minHeight="200px">
                Hello world
            </pl-dialog>
            <pl-button label="最大宽高" @click="val[3] = true"/>
            <pl-dialog v-model="val[3]" maxWidth="400" maxHeight="600px">
                {{str}}
            </pl-dialog>
        </demo-row>
        <demo-row title="通过设置 wrapperPadding 调整 对话框偏移位置">
            <pl-button label="wrapperPadding" @click="val[4] = true"/>
            <pl-dialog v-model="val[4]" wrapperPadding="0 0">
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="去掉内容内边距">
            <pl-button label="contentPadding" @click="val[41] = true"/>
            <pl-dialog v-model="val[41]" :contentPadding="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="标题">
            <pl-button label="title" @click="val[5] = true"/>
            <pl-dialog v-model="val[5]" :title="title">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="全屏">
            <pl-button label="fullscreen" @click="val[6] = true"/>
            <pl-dialog v-model="val[6]" fullscreen>
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="无遮罩">
            <pl-button label="mask" @click="val[7] = true"/>
            <pl-dialog v-model="val[7]" :mask="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="自定义样式class">
            <pl-button label="dialogClass" @click="val[8] = true"/>
            <pl-dialog v-model="val[8]" dialogClass="demo-dialog">
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="禁用点击遮罩的时候触发cancel动作">
            <pl-button label="cancelOnClickMask" @click="val[9] = true"/>
            <pl-dialog v-model="val[9]" :cancelOnClickMask="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="去掉关闭按钮">
            <pl-button label="showClose" @click="val[11] = true"/>
            <pl-dialog v-model="val[11]" :showClose="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="关闭前校验">
            <pl-button label="beforeClose" @click="val[12] = true"/>
            <pl-dialog v-model="val[12]" :beforeClose="beforeClose">
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="垂直居中">
            <pl-button label="center" @click="val[13] = true"/>
            <pl-dialog v-model="val[13]" center>
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="destroyOnClose">
            <pl-button label="关闭时销毁" @click="val[14] = true"/>
            <pl-dialog v-model="val[14]">
                <pl-input/>
            </pl-dialog>
            <pl-button label="关闭时不销毁" @click="val[15] = !val[15]"/>
            <pl-dialog v-model="val[15]" :destroyOnClose="false">
                <pl-input/>
            </pl-dialog>
        </demo-row>

        <demo-row title="确认以及取消按钮">
            <pl-button label="确认以及取消按钮" @click="val[16] = true"/>
            <pl-dialog v-model="val[16]"
                       confirmButton
                       cancelButton
                       @confirm="$message.success('confirm')"
                       @cancel="$message.error('cancel')"
                       confirmButtonText="保存"
                       cancelButtonText="不保存"
            >
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="加载状态">
            <pl-button label="loading" @click="val[17] = true"/>
            <pl-dialog v-model="val[17]" :loading="val[18]">
                <pl-button-group>
                    <pl-button label="open loading" @click="openLoading"/>
                    <pl-button @click="val[16] = true" label="open previous dialog"/>
                </pl-button-group>
            </pl-dialog>
        </demo-row>

        <demo-row title="隐藏标题">
            <pl-button label="隐藏标题" @click="val[19] = true"/>
            <pl-dialog v-model="val[19]" :showHead="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="弹框位置">
            <pl-button label="LEFT" @click="val[20] = true"/>
            <pl-dialog v-model="val[20]" :wrapperPadding="false" horizontal="start" fullHeight transition="pl-transition-dialog-left" confirmButton cancelButton>
                Hello world
            </pl-dialog>
            <pl-button label="RIGHT" @click="val[21] = true"/>
            <pl-dialog v-model="val[21]" :wrapperPadding="false" horizontal="end" fullHeight transition="pl-transition-dialog-right">
                Hello world
            </pl-dialog>
            <pl-button label="TOP" @click="val[22] = true"/>
            <pl-dialog v-model="val[22]" :wrapperPadding="false" vertical="start" fullWidth transition="pl-transition-dialog-top" confirmButton cancelButton>
                Hello world
            </pl-dialog>
            <pl-button label="BOTTOM" @click="val[23] = true"/>
            <pl-dialog v-model="val[23]" :wrapperPadding="false" vertical="end" fullWidth transition="pl-transition-dialog-bottom" confirmButton cancelButton>
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="自定义完全控制对话框">
            <pl-button label="open" @click="val[24] = true"/>
            <pl-dialog v-model="val[24]" disabledConfirm disabledCancel :showClose="false">
                用户不能通过点击关闭按钮、遮罩或者 ESC按键、ENTER按键关闭弹框，只能通过开发者预定义好的动作才能关闭弹框
                <pl-button label="关闭" @click="val[24] = false" mode="stroke" slot="foot"/>
                <pl-button label="确认" @click="$message('confirm')" slot="foot"/>
            </pl-dialog>
        </demo-row>

    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";
    import data from '../data/data-1'

    const str = JSON.stringify(data, null, 2)

    export default {
        name: "demo-dialog",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                str,
                title: new Promise((resolve) => {
                    setTimeout(() => resolve('异步标题'), 1000)
                })
            }
        },
        methods: {
            async beforeClose() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        let flag = Math.random() > 0.5
                        this.$message({
                            message: flag ? 'close success' : 'close reject',
                            status: flag ? 'primary' : 'error'
                        })
                        resolve(flag)
                    }, 1000)
                })
            },
            async openLoading() {
                this.val[18] = true
                await this.$plain.utils.delay(2000)
                this.val[18] = false
            },
        },
    }
</script>

<style lang="scss">
    .demo-dialog {
        .pl-dialog-content {
            color: #12b4a5;
        }
    }
</style>