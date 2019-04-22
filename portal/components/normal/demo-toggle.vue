<template>
    <div class="demo-toggle">
        <im-demo-row title="基本用法">
            <im-toggle v-model="val1"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-toggle v-for="(item,index) in colors" :color="item" :key="index" :value="true"/>
        </im-demo-row>
        <im-demo-row title="大小尺寸">
            <im-demo-row-item title="large">
                <im-toggle v-for="(item,index) in colors" :color="item" :key="index" :value="true" size="large"/>
            </im-demo-row-item>
            <im-demo-row-item title="default">
                <im-toggle v-for="(item,index) in colors" :color="item" :key="index" :value="true" size="default"/>
            </im-demo-row-item>
            <im-demo-row-item title="small">
                <im-toggle v-for="(item,index) in colors" :color="item" :key="index" :value="true" size="small"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="禁用与只读">
            <im-demo-row-item title="禁用">
                <im-toggle v-model="val1" disabled/>
            </im-demo-row-item>
            <im-demo-row-item title="只读">
                <im-toggle v-model="val1" readonly/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="设置真假值">
            <im-toggle v-model="val2" true-value="Y" false-value="N"/>
            <im-button>val2:{{val2}}</im-button>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-toggle",
        data() {
            return {
                val1: true,
                val2: 'Y',
                colors: ['primary', 'success', 'warn', 'error', 'info', 'disabled'],
            }
        },
    }
</script>

<style lang="scss">

</style>