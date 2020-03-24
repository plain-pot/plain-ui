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
            <pl-button label="dialogClass" @click="val[7] = true"/>
            <pl-dialog v-model="val[7]" dialogClass="demo-dialog">
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="禁用点击遮罩的时候触发cancel动作">
            <pl-button label="dialogClass" @click="val[8] = true"/>
            <pl-dialog v-model="val[8]" :closeOnClickMask="false">
                Hello world
            </pl-dialog>
        </demo-row>
        <demo-row title="禁用点击 esc 按键的时候触发cancel动作">
            <pl-button label="dialogClass" @click="val[9] = true"/>
            <pl-dialog v-model="val[9]" :closeOnPressEscape="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="去掉关闭按钮">
            <pl-button label="showClose" @click="val[10] = true"/>
            <pl-dialog v-model="val[10]" :showClose="false">
                Hello world
            </pl-dialog>
        </demo-row>

        <demo-row title="关闭前校验">
            <pl-button label="beforeClose" @click="val[10] = true"/>
            <pl-dialog v-model="val[10]" :beforeClose="beforeClose">
                Hello world
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