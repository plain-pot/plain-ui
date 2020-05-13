<template>
    <div class="demo-line">
        <span class="demo-line-title" v-if="!!title" ref="title" :style="titleStyles">{{title}}</span>
        <div class="demo-line-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";

    export default {
        name: "demo-line",
        inject: {
            PlDemoRow: {default: null}
        },
        props: {
            title: {},
            labelWidth: {type: [String, Number]},
        },
        data() {
            return {}
        },
        computed: {
            titleStyles() {
                let styles = {}
                let width;
                if (this.labelWidth != null) width = this.labelWidth
                else {
                    if (!!this.PlDemoRow.maxTitleWidth) {
                        width = this.PlDemoRow.maxTitleWidth + 9
                    }
                }
                if (width != null) {
                    styles.width = PlainUtils.suffixPx(width)
                }
                return styles
            },
        },
        mounted() {
            this.PlDemoRow.addItem(this)
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-line {
        margin-bottom: 6px;

        .demo-line-title {
            display: inline-block;
            text-align: right;
            padding-right: 9px;
            font-size: 12px;
            color: #606266;
        }

        .demo-line-content {
            display: inline-block;

            & > * {
                margin-right: 16px;
            }
        }
    }
</style>