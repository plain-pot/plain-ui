<template>
    <div class="loading">
        <demo-row title="基本用法">
            <pl-loading/>
        </demo-row>
        <demo-row title="类型">
            <pl-loading type="alpha"/>
            <pl-loading type="beta"/>
            <pl-loading type="gamma"/>
            <pl-loading type="ice" loading/>
            <pl-loading type="delta"/>
        </demo-row>
        <demo-row title="大小 font-size:32px">
            <div style="font-size: 32px">
                <pl-loading type="alpha"/>
                <pl-loading type="beta"/>
                <pl-loading type="gamma"/>
                <pl-loading type="ice" loading/>
                <pl-loading type="delta"/>
            </div>
        </demo-row>
        <demo-row title="状态（颜色)">
            <demo-line v-for="item in status" :key="item" :title="item">
                <pl-loading type="alpha" :status="item"/>
                <pl-loading type="beta" :status="item"/>
                <pl-loading type="gamma" :status="item"/>
                <pl-loading type="ice" loading :status="item"/>
                <pl-loading type="delta" loading :status="item"/>
            </demo-line>
        </demo-row>
        <demo-row title="自定义颜色">
            <pl-loading type="alpha" style="color: blueviolet"/>
            <pl-loading type="beta" style="color: blueviolet"/>
            <pl-loading type="gamma" style="color: blueviolet"/>
            <pl-loading type="ice" loading style="color: blueviolet"/>
            <pl-loading type="delta" loading style="color: blueviolet"/>
        </demo-row>
        <demo-row title="loading-mask">
            <pl-checkbox label="init" v-model="initFlag"/>
            <pl-checkbox label="open mask" v-model="loadingFlag"/>
            <span>如果父节点的position不为fixed、relative、absolute，pl-loading-mask会自动将父节点的样式设置为 relative</span>
            <div style="height: 300px;width: 300px;background-color: #f6f6f6;" v-if="initFlag">
                <pl-button label="this is button"/>
                <pl-loading-mask v-model="loadingFlag" message="loading..."/>
            </div>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "loading",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                loadingFlag: true,
                initFlag: false,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>