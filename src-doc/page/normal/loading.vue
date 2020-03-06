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
        </demo-row>
        <demo-row title="大小">
            <div style="font-size: 32px">
                <pl-loading type="alpha"/>
                <pl-loading type="beta"/>
                <pl-loading type="gamma"/>
                <pl-loading type="ice" loading/>
            </div>
        </demo-row>
        <demo-row title="状态（颜色)">
            <demo-line v-for="item in status" :key="item" :title="item">
                <pl-loading type="alpha" :status="item"/>
                <pl-loading type="beta" :status="item"/>
                <pl-loading type="gamma" :status="item"/>
                <pl-loading type="ice" loading :status="item"/>
            </demo-line>
        </demo-row>
        <demo-row title="自定义颜色">
            <pl-loading type="alpha" style="color: blueviolet"/>
            <pl-loading type="beta" style="color: blueviolet"/>
            <pl-loading type="gamma" style="color: blueviolet"/>
            <pl-loading type="ice" loading style="color: blueviolet"/>
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
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>