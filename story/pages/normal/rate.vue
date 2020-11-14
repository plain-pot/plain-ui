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
            <demo-line title="普通模式">
                <pl-rate mode="normal" :modelValue="2.4"/>
            </demo-line>
            <demo-line title="半星模式">
                <pl-rate mode="half" :modelValue="2.5"/>
            </demo-line>
            <demo-line title="整星模式">
                <pl-rate mode="all" :modelValue="2"/>
            </demo-line>
        </demo-row>
        <demo-row title="状态">
            <demo-line title="预定义颜色">
                <pl-rate v-for="(item,index) in ['primary','success','warn','error','info']" :key="index" :status="item" :modelValue="3"/>
            </demo-line>
            <demo-line title="自定义颜色">
                <pl-rate style="color:rebeccapurple" :modelValue="3"/>
            </demo-line>
        </demo-row>
        <demo-row title="大小">
            <demo-line title="预定义大小">
                <pl-rate v-for="(item,index) in ['large','normal','mini']" :key="index" :size="item" v-model="val[2]"/>
            </demo-line>
            <demo-line title="自定义大小">
                <pl-rate style="font-size: 36px" v-model="val[2]"/>
            </demo-line>
            <demo-line>
                {{val[2]}}
            </demo-line>
        </demo-row>


        <demo-row title="设置激活icon与未激活icon">
            <pl-rate active-icon="el-icon-folder-s" inactive-icon="el-icon-folder" color="error" :modelValue="3"/>
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
    export default {
        name: "demo-rate",
        data() {
            return {
                val: {
                    2: 3,
                    20: true,
                    21: 3,
                },
                val1: 2.5,
            }
        },
    }
</script>

<style lang="scss">

</style>