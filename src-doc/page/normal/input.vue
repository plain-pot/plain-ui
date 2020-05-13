<template>
    <div class="demo-input">
        <demo-row title="基本用法">
            <pl-input v-model="val[0]" clearIcon/>
            <pl-input v-model="val[0]" clearIcon suffixIcon="el-icon-edit-outline"/>
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

        <demo-row title="enter按键事件节流">
            <pl-input placeholder="1000ms" @enter="$message(String(Date.now()))" throttleEnter/>
            <pl-input placeholder="500ms" @enter="$message(String(Date.now()))" :throttleEnter="500"/>
        </demo-row>

        <demo-row title="自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)">
            <pl-input placeholder="异步任务" @enter="asyncHandler" autoLoading suffixIcon="el-icon-view" clearIcon/>
        </demo-row>

        <demo-row title="禁用">
            <pl-checkbox v-model="disabledFlag" label="disabledFlag"/>
            <pl-input :disabled="disabledFlag"/>
            <pl-input :disabled="disabledFlag" suffixIcon="el-icon-search"/>
            <pl-input :disabled="disabledFlag" textarea/>
        </demo-row>

        <demo-row title="状态">
            <demo-line title="input">
                <pl-input v-for="item in status" :status="item" :key="item"/>
            </demo-line>
            <demo-line title="textarea">
                <pl-input v-for="item in status" :status="item" :key="item" textarea/>
            </demo-line>

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

        <demo-row title="加载状态">
            <demo-line title="loading">
                <pl-input v-model="val[0]" clearIcon suffixIcon="el-icon-full-screen" loading/>
            </demo-line>
            <demo-line title="normal">
                <pl-input v-model="val[0]" clearIcon suffixIcon="el-icon-full-screen"/>
            </demo-line>
            <span>{{val[0]}}</span>
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

            <demo-line>
                <pl-checkbox v-model="prepend" label="show prepend"/>
                <pl-checkbox v-model="append" label="show append"/>
            </demo-line>

            <pl-input prefixIcon="el-icon-search" suffixIcon="el-icon-search" clearIcon @click-clear-icon="log('click-clear-icon')" @click-prefix-icon="log('click-prefix-icon')">
                <div slot="prepend" v-if="prepend" style="width:75px;text-align: right">
                    <pl-dropdown>
                        <span>{{val[3]}}:// <pl-icon class="el-icon-arrow-down"/></span>
                        <pl-dropdown-menu slot="dropdown">
                            <pl-dropdown-item v-for="item in ['ftp','http','https','ssh']" :key="item" :label="`${item}://`" @click="val[3] = item"/>
                        </pl-dropdown-menu>
                    </pl-dropdown>
                </div>
                <div slot="append" v-if="append">append content</div>
            </pl-input>
            <pl-input prefixIcon="el-icon-search" suffixIcon="el-icon-search" clearIcon @click-clear-icon="log('click-clear-icon')" @click-prefix-icon="log('click-prefix-icon')">
                <pl-select slot="prepend" v-if="prepend" :data="['ftp','http','https','ssh']" v-model="val[3]" :inputProps="{width:100}"/>
                <div slot="append" v-if="append">append content</div>
            </pl-input>

        </demo-row>
        <demo-row title="自定义内容">
            <pl-input suffixIcon="el-icon-search">
                <span>自定义内容</span>
            </pl-input>
        </demo-row>
        <demo-row title="大小">
            <pl-input size="large"/>
            <pl-input/>
            <pl-input size="mini"/>
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
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "demo-input",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                val: {
                    3: 'https'
                },
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