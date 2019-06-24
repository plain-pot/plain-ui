<template>
    <div class="demo-color">
        <im-demo-row title="基本色">
            <span class="color-box primary">Primary</span>
        </im-demo-row>
        <im-demo-row title="辅助色">
            <span class="color-box success">Success</span>
            <span class="color-box warn">Warn</span>
            <span class="color-box error">Error</span>
            <span class="color-box info">Info</span>
        </im-demo-row>
        <im-demo-row title="背景色">
            <span class="color-box background">Default</span>
            <span class="color-box background-lighter">Lighter</span>
            <span class="color-box background-deeper">Deeper</span>
            <span class="color-box background-active">Active</span>
        </im-demo-row>
        <im-demo-row title="文字色">
            <span class="color-box font-content">Content</span>
            <span class="color-box font-title">Title</span>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-color"
    }
</script>

<style lang="scss">
    @include themeWrap {
        .demo-color {
            padding: 20px;
            .color-box {
                display: inline-flex;
                width: 156px;
                height: 80px;
                align-items: center;
                justify-content: center;
                border-radius: plVar(borderFillet);
                box-shadow: 0 0 6px #ddd;
            }
            @include plColors {
                .color-box.#{$key} {
                    background: linear-gradient(to right, $value, rgba($value, 0.5));
                    color: white;
                }
            }

            .background {
                background-color: plVar(backgroundColor);
            }
            .background-lighter {
                background-color: plVar(backgroundColorLighter);
            }
            .background-deeper {
                background-color: plVar(backgroundColorDeeper);
            }
            .background-active {
                background-color: plVar(backgroundColorActive);
            }

            .font-content {
                background-color: plVar(colorContent);
                color: white;
            }
            .font-title {
                background-color: plVar(colorTitle);
                color: white;
            }
        }
    }
</style>