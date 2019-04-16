<template>
    <div class="demo-loading">
        <im-demo-row title="基本用法">
            <im-loading/>
        </im-demo-row>
        <im-demo-row title="基本用法">
            <im-loading type="section-one"/>
            <im-loading type="section-two"/>
            <im-loading type="section-three"/>
            <im-loading type="section-part"/>
            <im-loading type="section-dot"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-loading style="font-size: 3em"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-loading"
    }
</script>

<style lang="scss">

</style>