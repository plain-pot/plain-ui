<template>
    <div class="demo-loading">
        <demo-row title="基本用法">
            <pl-loading/>
        </demo-row>
        <demo-row title="类型">
            <pl-loading type="alpha"/>
            <pl-loading type="beta"/>
            <pl-loading type="gamma"/>
            <pl-loading type="ice"/>
            <pl-loading type="delta"/>
        </demo-row>
        <demo-row title="大小 font-size:32px">
            <div style="font-size: 32px">
                <pl-loading type="alpha"/>
                <pl-loading type="beta"/>
                <pl-loading type="gamma"/>
                <pl-loading type="ice"/>
                <pl-loading type="delta"/>
            </div>
        </demo-row>
        <demo-row title="状态（颜色)">
            <pl-loading v-for="item in ['primary','success','warn','error','info']" :key="item" type="delta" :status="item"/>
        </demo-row>
        <demo-row title="自定义颜色">
            <pl-loading type="alpha" style="color: blueviolet"/>
            <pl-loading type="beta" style="color: blueviolet"/>
            <pl-loading type="gamma" style="color: blueviolet"/>
            <pl-loading type="ice" style="color: blueviolet"/>
            <pl-loading type="delta" style="color: blueviolet"/>
        </demo-row>

        <demo-row title="组件调用loading-mask">
            <pl-checkbox label="init" v-model="flag1.init"/>
            <pl-checkbox label="open mask" v-model="flag1.loading"/>
            <span>如果父节点的position不为fixed、relative、absolute，pl-loading-mask会自动将父节点的样式设置为 relative</span>
            <div style="height: 300px;width: 300px;background-color: #f6f6f6;" v-if="flag1.init">
                <pl-button label="this is button"/>
                <pl-loading-mask v-model="flag1.loading" message="loading..."/>
            </div>
        </demo-row>
        <demo-row title="指令调用loading-directive">
            <pl-checkbox label="init" v-model="flag2.init"/>
            <pl-checkbox label="open mask" v-model="flag2.loading"/>
            <div style="height: 300px;width: 300px;background-color: #f6f6f6;" v-if="flag2.init" v-loading="flag2.loading?{message:'加载中...'}:false">
                <pl-button label="this is button"/>
            </div>
        </demo-row>
        <demo-row title="$loading.mask">
            <pl-button label="全屏加载状态" @click="loadingMask"/>
        </demo-row>
    </div>
</template>

<script>
    import {delay} from "plain-utils/utils/delay";

    export default {
        name: "loading",
        data() {
            return {
                flag1: {
                    loading: true,
                    init: true,
                },
                flag2: {
                    loading: true,
                    init: true,
                },
                bar: null,
            }
        },
        methods: {
            async loadingMask() {
                const option = this.$loading.mask({message: '正在加载资源文件...'})
                this.$message('三秒钟之后关闭！')
                await delay(3000)
                option.close()
            },
        },
    }
</script>

<style lang="scss">

</style>