<template>
    <div class="pl-step-group" :class="classes">
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
            currentStatus: {type: String},                                  // 当前激活节点的状态
            type: {type: String, default: 'normal'},                        // 步骤条类型，normal、navigation
            vertical: {type: Boolean},                                      // 步骤条是否为纵向
            titleAlignBottom: {type: Boolean},                              // 默认情况下，标题会放在图标右侧，设置该属性可以改为放在图标下面

        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {

            // 刷新每个step的index，以便step知道自己处于哪个位置
            const refreshStepIndex = this.$plain.utils.debounce((): void => {
                this.items.forEach(item => item.refreshIndex())
            }, 100)
            return {
                items: [],
                refreshStepIndex,
                p_value: this.value,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-step-group-${this.vertical ? 'vertical' : 'horizontal'}`
                ]
            },
            currentIndex() {
                if (typeof this.p_value === "number") {
                    return this.p_value
                } else {
                    for (let i = 0; i < this.items.length; i++) {
                        const item = this.items[i];
                        if (item.val === this.p_value) return item.index
                    }
                }
            },
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
            &.pl-step-group-horizontal {
                display: flex;
                align-items: center;

                .pl-step {
                    flex: 1;

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
                        margin: 0 8px;

                        .pl-icon, .pl-loading {
                            font-size: 1.8em;
                        }

                        .pl-step-number {
                            .pl-icon {
                                font-size: 1.2em;
                            }
                        }
                    }

                    .pl-step-divider {
                        flex: 1;
                        height: 1px;
                        background-color: $icc;
                    }

                    .pl-step-head, .pl-step-body {
                        display: flex;
                    }

                    .pl-step-head {
                        align-items: center;
                        margin-bottom: 8px;

                        .pl-step-title {
                            font-size: 16px;
                            color: $ihc;
                            margin-right: 8px;
                        }
                    }

                    .pl-step-body {
                        align-items: flex-start;

                        .pl-step-icon {
                            border: none;
                        }
                    }

                    &.pl-step-has-icon {
                        .pl-step-head {
                            .pl-step-icon {
                                border: none;
                                position: relative;
                                top: 1px;
                            }
                        }
                    }

                    &.pl-step-last {
                        flex: initial;
                    }

                    &.pl-step-status-wait {
                        .pl-step-head {
                            .pl-step-title {
                                color: $icc;
                            }
                        }

                        .pl-step-body {
                            .pl-step-content {
                                color: $icc;
                            }
                        }
                    }

                    &.pl-step-status-finish {
                        .pl-step-head {
                            .pl-step-icon {
                                border-color: $colorPrimary;
                                color: $colorPrimary;
                            }

                            .pl-step-divider.pl-step-divider-next {
                                background-color: $colorPrimary;
                            }
                        }
                    }

                    &.pl-step-status-process {

                        .pl-step-head {
                            .pl-step-icon {
                                border-color: $colorPrimary;
                                background-color: $colorPrimary;
                                color: white;
                            }

                            .pl-step-title {
                                color: $colorPrimary;
                            }
                        }

                        .pl-step-body {
                            .pl-step-content {
                                color: $colorPrimary;
                            }
                        }

                        &.pl-step-has-icon {
                            .pl-step-icon {
                                border-color: initial;
                                background-color: initial;
                                color: $colorPrimary;
                            }
                        }
                    }

                    &.pl-step-status-error {

                    }
                }
            }
        }
    }
</style>