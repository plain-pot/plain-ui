<template>
    <div class="demo-input">
        <demo-row title="基本用法">
            <pl-input v-model="val[0]"/>
            <pl-input v-model="val[0]"/>
            <span>{{val[0]}}</span>
        </demo-row>

        <demo-row title="前后图标">
            <demo-line title="前置图标">
                <pl-input prefixIcon="el-icon-search" @click-prefix-icon="log('click-prefix-icon')" disabled/>
            </demo-line>
            <demo-line title="后置图标">
                <pl-input suffixIcon="el-icon-full-screen" @click-suffix-icon="log('click-suffix-icon')" readonly/>
            </demo-line>
            <demo-line title="前后置图标">
                <pl-input suffixIcon="el-icon-search" prefixIcon="el-icon-full-screen" @click-prefix-icon="log('click-prefix-icon')" @click-suffix-icon="log('click-suffix-icon')"/>
            </demo-line>
        </demo-row>
        <demo-row title="禁用">
            <pl-checkbox v-model="disabledFlag" label="disabledFlag"/>
            <pl-input :disabled="disabledFlag"/>
            <pl-input :disabled="disabledFlag" suffixIcon="el-icon-search"/>
            <pl-input :disabled="disabledFlag" textarea/>
        </demo-row>
        <demo-row title="清除图标">
            <demo-line title="基本用法">
                <pl-input clearIcon @click-clear-icon="log('click-clear-icon')"/>
            </demo-line>
            <demo-line title="自定义清除逻辑">
                <pl-input clearIcon @click-clear-icon="log('click-clear-icon')" :clearHandler="clearHandler"/>
            </demo-line>
            <demo-line title="带前置图标">
                <pl-input prefixIcon="el-icon-search" clearIcon @click-clear-icon="log('click-clear-icon')" @click-prefix-icon="log('click-prefix-icon')"/>
            </demo-line>
            <demo-line title="带前后置图标">
                <pl-input suffixIcon="el-icon-arrow-down" prefixIcon="el-icon-search" clearIcon @click-clear-icon="log('click-clear-icon')" @click-prefix-icon="log('click-prefix-icon')" @click-suffix-icon="log('click-suffix-icon')"/>
            </demo-line>
        </demo-row>
        <demo-row title="块级元素">
            <pl-input block style="margin-bottom: 12px"/>
            <pl-input block textarea/>
        </demo-row>
        <demo-row title="设置宽度(顺便测试 异步 props以及 函数 props)">
            <demo-line title="number:300">
                <pl-input :width="300"/>
            </demo-line>
            <demo-line title="string:300">
                <pl-input width="300"/>
            </demo-line>
            <demo-line title="string:300px">
                <pl-input width="300px"/>
            </demo-line>
            <demo-line title="function:300px">
                <pl-input :width="functionWidth"/>
            </demo-line>
            <demo-line title="promise:300px">
                <pl-input :width="asyncWidth"/>
            </demo-line>
        </demo-row>
        <demo-row title="输入框组">
            <pl-input prefixIcon="el-icon-search" suffixIcon="el-icon-search" clearIcon @click-clear-icon="log('click-clear-icon')" @click-prefix-icon="log('click-prefix-icon')">
                <div slot="prepend" v-if="prepend">prepend content</div>
                <div slot="append" v-if="append">append content</div>
            </pl-input>
            <r-checkbox v-model="prepend" label="prepend"/>
            <r-checkbox v-model="append" label="append"/>
        </demo-row>
        <demo-row title="自定义内容">
            <pl-input suffixIcon="el-icon-search">
                <span>自定义内容</span>
            </pl-input>
        </demo-row>
        <demo-row title="大小">
            <pl-input size="large"/>
            <pl-input/>
            <pl-input size="small"/>
        </demo-row>
        <demo-row title="形状">
            <pl-input shape="fillet"/>
            <pl-input shape="round"/>
            <pl-input shape="none"/>
        </demo-row>
        <demo-row title="文本域输入框">
            <pl-input textarea/>
        </demo-row>
        <demo-row title="文本域输入框：自适应高度">
            <demo-line title="基本用法">
                <pl-input textarea autoHeight :width="300" v-model="val[2]"/>
            </demo-line>
            <demo-line title="去掉最大高度">
                <pl-input textarea autoHeight :width="300" v-model="val[2]" :maxHeight="null"/>
            </demo-line>
        </demo-row>
        <demo-row title="密码框">
            <pl-input :suffixIcon="passwordVisible?'el-icon-lock':'el-icon-unlock'" @click-suffix-icon="passwordVisible = !passwordVisible" :nativeProps="{type: passwordVisible ? 'text' : 'password'}"/>
        </demo-row>
        <demo-row title="禁用以及只读">
            {{flag}}
            <demo-line title="禁用">
                <pl-checkbox v-model="flag.disabled"/>
                <pl-input :disabled="flag.disabled"/>
            </demo-line>
            <demo-line title="只读">
                <pl-checkbox v-model="flag.readonly"/>
                <pl-input :readonly="flag.readonly"/>
                <input type="text" :readonly="flag.readonly">
            </demo-line>
        </demo-row>

    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "demo-input",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                prepend: true,
                append: true,
                disabledFlag: true,
                passwordVisible: false,
                flag: {
                    disabled: true,
                    readonly: true,
                },
                clearHandler(val) {
                    console.log('clearHandler')
                },
                asyncWidth: new Promise(resolve => setTimeout(() => resolve('300px'), 2000)),
                functionWidth: () => '300px',
            }
        },
        methods: {
            log(val) {
                console.log(val)
            },
        },
    }
</script>

<style lang="scss">
</style>