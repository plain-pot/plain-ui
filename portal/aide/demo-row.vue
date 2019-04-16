<template>
    <div class="demo-row">
        <div class="demo-row-content">
            <div class="demo-row-title">
                <span v-if="!!title">{{title}}</span>
            </div>
            <div class="demo-row-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-row",
        props: {
            title: {},
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .demo-row {
            @include public-style;
            width: 100%;
            padding: plVar(padding);
            box-sizing: border-box;
            .demo-row-content {
                background-color: plVar(backgroundColorDeeper);
                width: 100%;
                height: max-content;
                border-radius: plVar(borderFillet);
                padding: plVar(paddingLarge);
                box-sizing: border-box;
            }
            .demo-row-title {
                display: flex;
                align-items: center;
                color: plVar(colorprimaryLight);
                border-bottom: solid 1px plVar(backgroundColor);
                padding-bottom: plVar(padding);
                span {
                    margin-right: 12px;
                }
            }
            .demo-row-body {
                margin-top: plVar(padding);
                & > *:not(:last-child) {
                    margin-right: 12px;
                }
            }
        }
    }
</style>