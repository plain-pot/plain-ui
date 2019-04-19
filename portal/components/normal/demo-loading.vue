<template>
    <div class="demo-loading">
        <im-demo-row title="基本用法">
            <im-loading/>
            <span>加载中...</span>
        </im-demo-row>
        <im-demo-row title="基本用法">
            <im-loading/>
            <im-loading type="section-one"/>
            <im-loading type="section-two"/>
            <im-loading type="section-three"/>
            <im-loading type="section-part"/>
            <im-loading type="section-dot"/>
        </im-demo-row>
        <im-demo-row title="颜色" class="color">
            <div>
                <im-loading color="primary"/>
                <im-loading type="section-one" color="primary"/>
                <im-loading type="section-two" color="primary"/>
                <im-loading type="section-three" color="primary"/>
                <im-loading type="section-part" color="primary"/>
                <im-loading type="section-dot" color="primary"/>
            </div>
            <div>
                <im-loading color="success"/>
                <im-loading type="section-one" color="success"/>
                <im-loading type="section-two" color="success"/>
                <im-loading type="section-three" color="success"/>
                <im-loading type="section-part" color="success"/>
                <im-loading type="section-dot" color="success"/>
            </div>
            <div>
                <im-loading color="warn"/>
                <im-loading type="section-one" color="warn"/>
                <im-loading type="section-two" color="warn"/>
                <im-loading type="section-three" color="warn"/>
                <im-loading type="section-part" color="warn"/>
                <im-loading type="section-dot" color="warn"/>
            </div>
            <div>
                <im-loading color="error"/>
                <im-loading type="section-one" color="error"/>
                <im-loading type="section-two" color="error"/>
                <im-loading type="section-three" color="error"/>
                <im-loading type="section-part" color="error"/>
                <im-loading type="section-dot" color="error"/>
            </div>
            <div>
                <im-loading color="info"/>
                <im-loading type="section-one" color="info"/>
                <im-loading type="section-two" color="info"/>
                <im-loading type="section-three" color="info"/>
                <im-loading type="section-part" color="info"/>
                <im-loading type="section-dot" color="info"/>
            </div>
            <div style="background-color: black">
                <im-loading color="white"/>
                <im-loading type="section-one" color="info"/>
                <im-loading type="section-two" color="info"/>
                <im-loading type="section-three" color="info"/>
                <im-loading type="section-part" color="info"/>
                <im-loading type="section-dot" color="info"/>
            </div>
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
    .demo-loading {
        .color {
            .demo-row-body {
                & > div {
                    display: inline-block;
                    margin-bottom: 12px;
                }
            }
        }
    }
</style>