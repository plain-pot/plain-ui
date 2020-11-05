<template>
    <div class="demo-button">

        <demo-row title="基本用法">
            <pl-button label="基本" @click="log(1)"/>
        </demo-row>
        <demo-row title="状态">
            <pl-button v-for="item in ['primary','success','warn','error','info']" :key="item" :label="item" :status="item"/>
        </demo-row>

        <demo-row title="模式">
            <demo-line :title="mode" v-for="mode in ['fill','stroke','text']" :key="mode">
                <pl-button v-for="item in ['primary','success','warn','error','info']" :key="item" :label="item" :status="item" :mode="mode"/>
            </demo-line>
        </demo-row>

        <demo-row title="形状">
            <pl-button v-for="item in ['fillet','round','square']" :key="item" :label="item" :shape="item"/>
        </demo-row>
        <demo-row title="大小">
            <pl-button v-for="item in ['large','normal','mini']" :key="item" :label="item" :size="item"/>
        </demo-row>
        <demo-row title="图标按钮">
            <pl-button icon="el-icon-search" label="搜索"/>
            <pl-button icon="el-icon-s-tools" label="搜索" shape="round"/>
            <pl-button icon="el-icon-search" shape="round" icon-only/>
            <pl-button icon="el-icon-search" icon-only/>
            <pl-button icon="el-icon-search" mode="stroke" icon-only/>
            <pl-button icon="el-icon-search" mode="stroke" shape="round" icon-only/>
            <pl-button icon="el-icon-search" mode="text" icon-only/>
        </demo-row>

        <demo-row title="块级按钮">
            <pl-button label="按钮" block/>
        </demo-row>
        <demo-row title="禁用">
            <pl-button label="按钮" mode="fill" disabled icon="el-icon-search"/>
            <pl-button label="按钮" mode="stroke" disabled/>
            <pl-button label="按钮" mode="text" disabled/>
        </demo-row>

        <demo-row title="加载状态">
            <pl-checkbox v-model="loadingFlag" label="开启loading"/>
            <pl-button label="搜索" :loading="loadingFlag" width="90"/>
            <pl-button icon="el-icon-search" label="搜索" :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" label="搜索" shape="round" :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" shape="round" icon-only :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" icon-only :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" mode="stroke" icon-only :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" mode="stroke" shape="round" icon-only :loading="loadingFlag"/>
            <pl-button icon="el-icon-search" mode="text" icon-only :loading="loadingFlag"/>
        </demo-row>

        <demo-row title="click节流">
            <pl-button label="1000ms" @click="$message(String(Date.now()))" throttleClick/>
            <pl-button label="500ms" @click="$message(String(Date.now()))" :throttleClick="500"/>
        </demo-row>

        <demo-row title="自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)">
            <pl-button label="异步任务" :asyncHandler="asyncHandler" autoLoading/>
        </demo-row>

        <demo-row title="按钮异步文本">
            <pl-button :label="asyncLabel" @click="log(1)"/>
        </demo-row>

        <demo-row title="按钮组：基本用法">
            <pl-button-group>
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
        </demo-row>
        <demo-row title="按钮组：模式">
            <pl-button-group mode="fill">
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
            <pl-button-group mode="stroke">
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
            <pl-button-group mode="text">
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
        </demo-row>
        <demo-row title="按钮组：继承属性">
            <demo-line title="大小">
                <pl-button-group size="large">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
                <pl-button-group size="normal">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
                <pl-button-group size="mini">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
            </demo-line>
            <demo-line title="形状">
                <pl-button-group shape="fillet">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
                <pl-button-group shape="round">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
                <pl-button-group shape="none">
                    <pl-button label="丛林"/>
                    <pl-button label="山脉"/>
                    <pl-button label="火山"/>
                </pl-button-group>
            </demo-line>
        </demo-row>
        <demo-row title="按钮组方向">
            <pl-button-group vertical>
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
            <pl-button-group vertical mode="stroke">
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
            <pl-button-group vertical mode="text">
                <pl-button label="丛林"/>
                <pl-button label="山脉"/>
                <pl-button label="火山"/>
            </pl-button-group>
        </demo-row>

        <demo-row title="按钮组禁用与只读">
            <pl-button-group disabled>
                <pl-button label="丛林" @click="log('丛林')"/>
                <pl-button label="山脉" @click="log('山脉')"/>
                <pl-button label="火山" @click="log('火山')"/>
            </pl-button-group>
            <pl-button-group readonly>
                <pl-button label="丛林" @click="log('丛林')"/>
                <pl-button label="山脉" @click="log('山脉')"/>
                <pl-button label="火山" @click="log('火山')"/>
            </pl-button-group>
        </demo-row>

    </div>
</template>

<script>

    import {delay} from "plain-utils/utils/delay";

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
            async asyncHandler() {
                this.$message('async task start')
                await delay(3000)
                if (Math.random() > 0.5) {
                    this.$message.error('async task error')
                    throw new Error('异步任务出错')
                } else {
                    this.$message.success('async task end')
                }
            },
            log(...args) {
                console.log(...args)
            },
        },
    }
</script>

<style lang="scss">
</style>