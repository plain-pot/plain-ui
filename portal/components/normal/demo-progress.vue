<template>
    <div class="demo-progress">
        <im-demo-row title="基本用法">
            <im-progress ref="progress1" :value="65"/>
        </im-demo-row>
        <im-demo-row title="自定义颜色">
            <im-progress innerColor="blueviolet" outerColor="#ddd" :value="30"/>
        </im-demo-row>
        <im-demo-row title="状态">
            <im-progress  :value="100" status="success"/>
            <im-progress  :value="25" status="error"/>
        </im-demo-row>
        <im-demo-row title="内部文字">
            <im-progress inlineText :value="30"/>
            <im-progress inlineText :value="10"/>
            <im-progress inlineText :value="100" status="success"/>
            <im-progress inlineText :value="10" status="error"/>
        </im-demo-row>
        <im-demo-row title="圆形进度条">
            <im-progress type="circle" :value="80"/>
            <im-progress type="circle" :value="80" innerColor="blueviolet" outerColor="#ddd"/>
            <im-progress type="circle" :value="100" status="success"/>
            <im-progress type="circle" :value="20" status="error"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-progress"
    }
</script>

<style lang="scss">
</style>