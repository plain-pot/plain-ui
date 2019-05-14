<template>
    <div class="demo-number">
        <im-demo-row title="基本用法">
            <im-number v-model="val1"/>
            <im-button>val1:{{val1}}</im-button>
        </im-demo-row>
        <im-demo-row title="加减大小间隔">
            <im-number :step="100"/>
        </im-demo-row>
        <im-demo-row title="最大500,最小值100">
            <im-number :min="100" :max="500" v-model="val2"/>
            <im-button>val2:{{val2}}</im-button>
        </im-demo-row>
        <im-demo-row title="不显示加减控制器">
            <im-number no-controller/>
        </im-demo-row>

        <im-demo-row title="类型">
            <im-demo-row-item title="fill">
                <im-number v-for="(item,index) in colors" :input="{color:item,type:'fill'}" :key="index"/>
            </im-demo-row-item>
            <im-demo-row-item title="line">
                <im-number v-for="(item,index) in colors" :input="{color:item,type:'line'}" :key="index" box-type="line"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="颜色">
            <im-demo-row-item title="line">
                <im-number v-for="(item,index) in colors" :input="{color:item,type:'line'}" :key="index"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-demo-row-item title="none">
                <im-number v-for="(item,index) in colors" :input="{color:item,shape:'none'}" :key="index"/>
            </im-demo-row-item>
            <im-demo-row-item title="fillet">
                <im-number v-for="(item,index) in colors" :input="{color:item,shape:'fillet'}" :key="index"/>
            </im-demo-row-item>
            <im-demo-row-item title="round">
                <im-number v-for="(item,index) in colors" :input="{color:item,shape:'round'}" :key="index"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-demo-row-item title="large">
                <im-number v-for="(item,index) in colors" :input="{color:item,size:'large'}" :key="index"/>
            </im-demo-row-item>
            <im-demo-row-item title="default">
                <im-number v-for="(item,index) in colors" :input="{color:item,size:'default'}" :key="index"/>
            </im-demo-row-item>
            <im-demo-row-item title="small">
                <im-number v-for="(item,index) in colors" :input="{color:item,size:'small'}" :key="index"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="加载图标">
            <im-number v-for="(item,index) in colors" :input="{color:item,loading:true}" :key="index"/>
        </im-demo-row>

        <im-demo-row title="禁用样式">
            <im-number v-for="(item,index) in colors" :input="{color:item}" :key="index" disabled value="111" @click="log('click')" @clear="log('clear')"/>
        </im-demo-row>
        <im-demo-row title="只读">
            <im-number v-for="(item,index) in colors" :input="{color:item}" :key="index" readonly value="111" @click="log('click')" @clear="log('clear')"/>
        </im-demo-row>

        <im-demo-row title="输入框类型">
            <im-number :input="{inputType:'password',placeholder:'password'}"/>
            <im-number :input="{inputType:'number',placeholder:'number'}"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-number",
        data() {
            return {
                colors: ['primary', 'success', 'warn', 'error', 'info'],
                val1: null,
                val2: null,
            }
        },
    }
</script>

<style lang="scss">

</style>