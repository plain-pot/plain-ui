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
        <demo-row title="颜色">
            <div style="color: #12b4a5">
                <pl-loading type="alpha"/>
                <pl-loading type="beta"/>
                <pl-loading type="gamma"/>
                <pl-loading type="ice" loading/>
            </div>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "loading",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>