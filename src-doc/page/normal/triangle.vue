<template>
    <div class="demo-triangle">
        <demo-row title="基本用法">
            <demo-line class="wrapper">
                <pl-triangle direction="top"/>
                <pl-triangle direction="bottom"/>
                <pl-triangle direction="left"/>
                <pl-triangle direction="right"/>
            </demo-line>
        </demo-row>

        <demo-row title="只要一半">
            <demo-line class="wrapper" title="top">
                <pl-triangle direction="top" half="start"/>
                <pl-triangle direction="top" half="end"/>
            </demo-line>
            <demo-line class="wrapper" title="bottom">
                <pl-triangle direction="bottom" half="start"/>
                <pl-triangle direction="bottom" half="end"/>
            </demo-line>
            <demo-line class="wrapper" title="left">
                <pl-triangle direction="left" half="start"/>
                <pl-triangle direction="left" half="end"/>
            </demo-line>
            <demo-line class="wrapper" title="right">
                <pl-triangle direction="right" half="start"/>
                <pl-triangle direction="right" half="end"/>
            </demo-line>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "triangle"
    }
</script>

<style lang="scss">
    @include theme {
        .demo-triangle {
            .wrapper {
                color: $colorPrimary;
            }
        }
    }
</style>