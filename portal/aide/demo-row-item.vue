<template>
    <div class="demo-row-item">
        <span class="demo-row-item-title" :style="titleStyles" v-if="title">{{title}}</span>
        <div class="demo-row-item-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-row-item",
        props: {
            title: {},
            width: {},
        },
        computed: {
            titleStyles() {
                const styles = {}
                !!this.width && (styles.width = this.$plain.$utils.unit(this.width))
                return styles
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .demo-row-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 12px;
            .demo-row-item-title {
                font-size: 14px;
                width: 100px;
                color: plVar(colorTitle);
            }
            .demo-row-item-content {
                & > * {
                    margin-right: 12px;
                }
            }
        }
    }
</style>