<template>
    <div class="pl-step-container" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    import {ThrottleMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-step-container",
        mixins: [ThrottleMixin],
        props: {
            direction: {type: String, default: 'horizontal'},
            value: {},
        },
        data() {
            return {
                items: [],
            }
        },
        computed: {
            classes() {
                return [
                    `pl-step-container-${this.direction}`
                ]
            },
        },
        methods: {
            pl_add(item) {
                this.items.push(item)
                this.pl_throttle(item, this.pl_updateItemIndex)
            },
            pl_remove(item) {
                this.items.splice(this.items.indexOf(item), 1)
            },
            async pl_updateItemIndex() {
                await this.$plain.nextTick()
                let itemEls = [];
                for (let item of  document.querySelectorAll('.pl-step')) itemEls.push(item)
                this.items.forEach(item => item.p_index = itemEls.indexOf(item.$el))
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-step-container {
            &.pl-step-container-horizontal {
                width: 100%;
                display: flex;
                align-items: flex-start;

                .pl-step {
                    flex: 1;
                    display: flex;
                    color: plVar(colorContentSub);

                    .pl-step-body {
                        flex: 1;

                        .pl-step-title-wrapper {
                            font-weight: bold;
                            font-size: 14px;
                            display: flex;
                            align-items: center;
                            box-sizing: border-box;
                            padding-right: 16px;
                            padding-bottom: 16px;
                            padding-top: 4px;

                            .pl-step-title-line {
                                height: 1px;
                                flex: 1;
                                background-color: plVar(colorContentSub);
                            }
                        }

                        .pl-step-title, .pl-step-content {
                            padding: 0 16px;
                            box-sizing: border-box;
                            letter-spacing: 1px;
                            color: inherit;
                        }
                    }

                    .pl-step-number {
                        height: 24px;
                        width: 24px;
                        border-radius: 30px;
                        border: solid 1px plVar(colorContentSub);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: inherit;
                    }
                }
            }

            .pl-step.pl-step-active {
                color: plVar(colorPrimaryDeep);

                .pl-step-number {
                    border-color: plVar(colorPrimaryDeep);
                }

                .pl-step-title-line {
                    background-color: plVar(colorPrimaryDeep);
                }
            }
            .pl-step.pl-step-complete {
                color: plVar(colorSuccessDeep);

                .pl-step-number {
                    border-color: plVar(colorSuccessDeep);
                }

                .pl-step-title-line {
                    background-color: plVar(colorSuccessDeep);
                }
            }

        }
    }
</style>