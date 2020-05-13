<template>
    <div class="demo-rate">
        <demo-row title="基本用法">
            <pl-rate v-model="val[1]"/>
            <pl-rate v-model="val[1]"/>
            {{val[1]}}
        </demo-row>
        <demo-row :title="'设置总分为10分：'+val1">
            <pl-rate v-model="val1" :total="10"/>
        </demo-row>
        <demo-row :title="'设置星星显示个数'+val1">
            <pl-rate :count="10" :total="10" v-model="val1"/>
        </demo-row>
        <demo-row title="模式">
            <demo-row-item title="普通模式">
                <pl-rate mode="normal" :value="2.4"/>
            </demo-row-item>
            <demo-row-item title="半星模式">
                <pl-rate mode="half" :value="2.5"/>
            </demo-row-item>
            <demo-row-item title="整星模式">
                <pl-rate mode="all" :value="2"/>
            </demo-row-item>
        </demo-row>
        <demo-row title="状态">
            <demo-line title="预定义颜色">
                <pl-rate v-for="(item,index) in status" :key="index" :status="item"/>
            </demo-line>
            <demo-line title="自定义颜色">
                <pl-rate style="color:rebeccapurple"/>
            </demo-line>
        </demo-row>
        <demo-row title="大小">
            <demo-line title="预定义大小">
                <pl-rate v-for="(item,index) in sizes" :key="index" :size="item" v-model="val[2]"/>
            </demo-line>
            <demo-line title="自定义大小">
                <pl-rate style="font-size: 36px" v-model="val[2]"/>
            </demo-line>
            <demo-line>
                {{val[2]}}
            </demo-line>
        </demo-row>


        <demo-row title="设置激活icon与未激活icon">
            <pl-rate active-icon="el-icon-s-goods" inactive-icon="el-icon-goods" color="error" :value="3"/>
        </demo-row>

        <demo-row title="禁用与只读">
            <demo-line>
                <pl-toggle v-model="val[20]"/>
            </demo-line>
            <demo-line>
                <pl-rate v-model="val[21]" :disabled="val[20]"/>
                <pl-rate v-model="val[21]" :readonly="val[20]"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "demo-rate",
        mixins: [DemoMixins],
        data() {
            return {
                val1: 2.5,
            }
        },
    }
</script>

<style lang="scss">

</style>