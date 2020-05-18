<template>
    <div class="demo-portal">
        <demo-row title="基本用法">
            <pl-checkbox v-model="val[0]" :label="val[0]?'撤销':'移动'"/>
            <pl-portal :value="val[0]" container=".demo-portal">
                <pl-input v-model="val[1]" suffixIcon="el-icon-star-off"/>
                <pl-button label="按钮" @click="$plain.log({...val})"/>
            </pl-portal>
            <pl-input v-model="val[1]"/>
        </demo-row>

        <demo-row title="测试组件销毁">
            <pl-checkbox v-model="val[2]" :label="val[2]?'销毁':'初始化'"/>
            <pl-checkbox v-model="val[3]" :label="val[3]?'撤销':'移动'"/>
            <pl-portal :value="val[3]" container=".demo-portal" v-if="val[2]">
                <pl-input v-model="val[1]" suffixIcon="el-icon-star-off"/>
                <pl-button label="按钮" @click="$plain.log({...val})"/>
            </pl-portal>
            <pl-input v-model="val[1]"/>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "dom",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                val: {
                    0: false,
                    3: false,
                }
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>