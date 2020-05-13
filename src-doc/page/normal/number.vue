<template>
    <div class="demo-number">
        <demo-row title="基本用法">
            <pl-number v-model="val[0]"/>
            <pl-number v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="最大最小值">
            <demo-line title="max:10">
                <pl-number v-model="val[1]" max="10"/>
                {{val[1]}}
            </demo-line>
            <demo-line title="min:1">
                <pl-number v-model="val[2]" min="1"/>
                {{val[2]}}
            </demo-line>
            <demo-line title="max:10,min:1">
                <pl-number v-model="val[3]" max="10" min="1"/>
                {{val[3]}}
            </demo-line>
        </demo-row>
        <demo-row title="计步器步长 step:10">
            <pl-number v-model="val[4]" step="10"/>
        </demo-row>
        <demo-row title="stepStrictly，step=10; 限制只能输入计步器步长的倍数">
            <pl-number v-model="val[5]" step="10" stepStrictly/>
        </demo-row>
        <demo-row title="精度">
            <demo-line title="整数:precision = 0">
                <pl-number v-model="val[6]" precision="0"/>
                {{val[6]}}
            </demo-line>
            <demo-line title="一位小数:precision = 1">
                <pl-number v-model="val[6]" precision="1"/>
                {{val[6]}}
            </demo-line>
            <demo-line title="两位小数:precision = 2">
                <pl-number v-model="val[6]" precision="2"/>
                {{val[6]}}
            </demo-line>
        </demo-row>
        <demo-row title="隐藏操作按钮">
            <pl-number hideButton v-model="val[7]"/>
            {{val[7]}}
        </demo-row>

        <demo-row title="禁用只读">
            <demo-line title="开关">
                <pl-checkbox v-model="val[8]"/>
            </demo-line>
            <demo-line title="禁用">
                <pl-number :disabled="val[8]" v-model="val[9]"/>
                {{val[9]}}
            </demo-line>
            <demo-line title="只读">
                <pl-number :readonly="val[8]" v-model="val[10]"/>
                {{val[10]}}
            </demo-line>
        </demo-row>

        <demo-row title="形状，大小，状态">
            <pl-number status="success" shape="round" size="large"/>
        </demo-row>
        <demo-row title="enter按键事件，可以立即得到最新的值">
            <pl-number v-model="val[11]" @enter="$plain.$message(val[11])"/>
            {{val[11]}}
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "number",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-number {

    }
</style>