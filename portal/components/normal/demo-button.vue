<template>
    <div class="demo-button">
        <im-demo-row title="基本用法">
            <im-button label="按钮" @click="$plain.log('click')"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-button v-for="item in ['primary','success','warn','error','info','disabled']" :label="item" :color="item" :key="item"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-button label="大" size="large"/>
            <im-button label="中" size="default"/>
            <im-button label="小" size="small"/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-button label="fill" type="fill"/>
            <im-button label="line" type="line"/>
            <im-button label="none" type="none"/>
        </im-demo-row>
        <im-demo-row title="加载中">
            <im-button label="按钮" loading @click="$plain.log('click')"/>
            <im-button label="按钮" loading @click="$plain.log('click')" type="line"/>
            <im-button label="按钮" loading @click="$plain.log('click')" type="none"/>
        </im-demo-row>
        <im-demo-row title="图标按钮">
            <im-button label="按钮" icon="pad-search"/>
            <im-button icon="pad-search"/>
            <im-button icon="pad-search" circle/>
            <im-button icon="pad-search" circle size="large"/>
        </im-demo-row>
        <im-demo-row title="长按钮">
            <im-button label="按钮" long/>
        </im-demo-row>
        <im-demo-row title="去除边距">
            <im-button label="按钮-按钮-按钮-按钮" noPadding/>
        </im-demo-row>
        <im-demo-row title="按钮组">
            <im-button-group><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
        </im-demo-row>
        <im-demo-row title="按钮组方向">
            <im-button-group vertical><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
            <im-button-group vertical><im-button label="北京" type="line"/><im-button label="上海" type="line"/><im-button label="广州" type="line"/></im-button-group>
            <im-button-group><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
            <im-button-group><im-button label="北京" type="line"/><im-button label="上海" type="line"/><im-button label="广州" type="line"/></im-button-group>
        </im-demo-row>
        <im-demo-row title="按钮组形状">
            <im-button-group shape="fillet"><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
            <im-button-group shape="round"><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
            <im-button-group shape="none"><im-button label="北京"/><im-button label="上海"/><im-button label="广州"/></im-button-group>
        </im-demo-row>
        <im-demo-row title="按钮激活状态">
            <im-button label="active" active/>
            <im-button-group>
                <im-button label="北京" :active="active === '北京'" @click="active = '北京'"/>
                <im-button label="上海" :active="active === '上海'" @click="active = '上海'"/>
                <im-button label="广州" :active="active === '广州'" @click="active = '广州'"/>
            </im-button-group>
            <im-button-group>
                <im-button label="北京" :active="active === '北京'" @click="active = '北京'" type="line"/>
                <im-button label="上海" :active="active === '上海'" @click="active = '上海'" type="line"/>
                <im-button label="广州" :active="active === '广州'" @click="active = '广州'" type="line"/>
            </im-button-group>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-button",
        data() {
            return {
                active: '上海',
            }
        },
    }
</script>

<style lang="scss">

</style>