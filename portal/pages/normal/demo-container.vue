<template>
    <div class="demo-container">
        <im-container>
            <div slot="leftOuter" class="left-outer">leftOuter</div>
            <div class="content">slot</div>
            <div slot="rightOuter" class="right-outer">rightOuter</div>
            <div slot="head" class="head">head</div>
            <div slot="foot" class="foot">foot</div>
            <div slot="left" class="left">left</div>
            <div slot="right" class="right">right</div>
        </im-container>
    </div>
</template>

<script>
    export default {
        name: "demo-container"
    }
</script>

<style lang="scss">
    .demo-container {
        .left-outer, .right-outer {
            width: 100px;
            background-color: #e2ddd4;
        }

        .left, .right {
            width: 200px;
            background-color: #d2c4d2;
        }

        .head, .foot {
            height: 100px;
            background-color: #d4f0f2;
        }
    }
</style>
