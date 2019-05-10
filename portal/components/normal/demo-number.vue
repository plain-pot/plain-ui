<template>
    <div class="demo-number">
        <im-demo-row title="基本用法">
            <im-number v-model="val1"/>
            <im-button>val1:{{val1}}</im-button>
        </im-demo-row>
        <im-demo-row title="加减大小间隔">
            <im-number :step="100"/>
        </im-demo-row>
        <im-demo-row title="最大最小值">
            <im-number :min="100" :max="500" v-model="val2"/>
            <im-button>val2:{{val2}}</im-button>
        </im-demo-row>
        <im-demo-row title="不显示加减控制器">
            <im-number no-controller/>
        </im-demo-row>

        <im-demo-row title="类型">
            <im-demo-row-item title="fill">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-type="fill"/>
            </im-demo-row-item>
            <im-demo-row-item title="line">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-type="line"/>
            </im-demo-row-item>
            <im-demo-row-item title="dashed">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-type="dashed"/>
            </im-demo-row-item>
            <im-demo-row-item title="none">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-type="none"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="颜色">
            <im-demo-row-item title="line">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-type="line"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-demo-row-item title="none">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-shape="none"/>
            </im-demo-row-item>
            <im-demo-row-item title="fillet">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-shape="fillet"/>
            </im-demo-row-item>
            <im-demo-row-item title="round">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-shape="round"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-demo-row-item title="large">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-size="large"/>
            </im-demo-row-item>
            <im-demo-row-item title="default">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-size="default"/>
            </im-demo-row-item>
            <im-demo-row-item title="small">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" box-size="small"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="前置图标以及后置图标">
            <im-demo-row title="前置后置icon">
                <im-number v-for="(item,index) in colors" :box-color="item" :key="index" prefix-icon="pl-date-fill" suffix-icon="pad-search"/>
            </im-demo-row>
        </im-demo-row>
        <im-demo-row title="加载图标">
            <im-number v-for="(item,index) in colors" :box-color="item" :key="index" loading/>
        </im-demo-row>

        <im-demo-row title="禁用样式">
            <im-number v-for="(item,index) in colors" :box-color="item" :key="index" disabled value="111" @click="log('click')" @clear="log('clear')"/>
        </im-demo-row>
        <im-demo-row title="只读">
            <im-number v-for="(item,index) in colors" :box-color="item" :key="index" readonly value="111" @click="log('click')" @clear="log('clear')"/>
        </im-demo-row>
        <im-demo-row title="去除默认padding">
            <im-number v-for="(item,index) in colors" :box-color="item" :key="index" :padding="false"/>
        </im-demo-row>
        <im-demo-row title="长输入框">
            <im-number long/>
        </im-demo-row>
        <im-demo-row title="设定宽度">
            <im-number :width="300"/>
        </im-demo-row>
        <im-demo-row title="校验">
            <im-number required ref="box"/>
        </im-demo-row>
        <im-demo-row title="输入框类型">
            <im-number type="password"/>
            <im-number type="number"/>
        </im-demo-row>
        <im-demo-row title="鼠标移动到上方的时候自动获取焦点">
            <im-number focus-on-hover/>
        </im-demo-row>
        <im-demo-row title="空值占位符">
            <im-number placeholder="输入xxx"/>
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