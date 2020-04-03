<template>
    <div class="pl-step-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    export default {
        name: "pl-step-group",
        provide() {
            return {
                plStepGroup: this,
            }
        },
        props: {
            value: {type: [String, Number]},                                // 双向绑定，指定当前步骤条的步骤，在step组件中，可以通过 status 属性覆盖状态
            type: {type: String, default: 'normal'},                        // 步骤条类型，normal、navigation
            direction: {type: String, default: 'horizontal'},               // 步骤条方向
            titleAlignBottom: {type: Boolean},                              // 默认情况下，标题会放在图标右侧，设置该属性可以改为放在图标下面

        },
        data() {

            // 刷新每个step的index，以便step知道自己处于哪个位置
            const refreshStepIndex = this.$plain.utils.debounce((): void => {
                this.items.forEach(item => item.refreshIndex())
            }, 100)
            return {
                items: [],
                refreshStepIndex,
            }
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            addItem(item) {
                this.items.push(item)
                this.refreshStepIndex()
            },
            removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1)
                this.refreshStepIndex()
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-step-group {
            display: flex;
            align-items: flex-start;

            .pl-step {
                flex: 1;
                display: flex;
                align-items: center;

                .pl-step-icon {
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                    line-height: 32px;
                    text-align: center;
                    border-radius: 32px;
                    border: solid 1px $ibc;
                    display: inline-block;
                    color: $icc;
                    .pl-icon {
                        font-size: 1.2em;
                    }
                    margin-right: 8px;
                }

                .pl-step-body {
                    .pl-step-title {
                        color: $ihc;
                        font-size: 16px;
                    }

                    .pl-step-content {
                        color: $itc;
                    }
                }
            }
        }
    }
</style>