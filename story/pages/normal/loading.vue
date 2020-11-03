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
            <pl-loading v-for="item in ['primary','success','warn','error','info']" :key="item" type="beta" :status="item"/>
        </demo-row>
        <demo-row title="自定义颜色">
            <pl-loading type="alpha" style="color: blueviolet"/>
            <pl-loading type="beta" style="color: blueviolet"/>
            <pl-loading type="gamma" style="color: blueviolet"/>
            <pl-loading type="ice" style="color: blueviolet"/>
            <pl-loading type="delta" style="color: blueviolet"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "loading"
    }
</script>

<style lang="scss">

</style>