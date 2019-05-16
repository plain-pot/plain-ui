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
            mini: {type: Boolean}
        },
        data() {
            return {
                items: [],
            }
        },
        computed: {
            classes() {
                return [
                    `pl-step-container-${this.direction}`,
                    `pl-step-size-${this.mini ? 'mini' : 'default'}`,
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
                for (let item of  this.$el.querySelectorAll('.pl-step')) itemEls.push(item)
                this.items.forEach(item => item.p_index = itemEls.indexOf(item.$el))
            },
        },
    }
</script>

<style lang="scss">

    $titleHeight: 30px;

    $step-size: (
            default:(
                    titleHeight:30px,
                    titleFontSize:15px,
                    contentFontSize:13px,
                    largePadding:16px,
                    smallPadding:8px,
                    iconFontSize:22px,
                    numberSize:24px,
            ),
            mini:(
                    titleHeight:20px,
                    titleFontSize:14px,
                    contentFontSize:12px,
                    largePadding:8px,
                    smallPadding:4px,
                    iconFontSize:14px,
                    numberSize:16px,
            ),
    );

    @mixin stepSize {
        @each $key, $map in $step-size {
            &.pl-step-size-#{$key} {
                $titleHeight: map_get($map, titleHeight) !global;
                $titleFontSize: map_get($map, titleFontSize) !global;
                $contentFontSize: map_get($map, contentFontSize) !global;
                $largePadding: map_get($map, largePadding) !global;
                $smallPadding: map_get($map, smallPadding) !global;
                $iconFontSize: map_get($map, iconFontSize) !global;
                $numberSize: map_get($map, numberSize) !global;
                @content;
            }
        }
    }

    @include themeWrap {
        .pl-step-container {

            @include stepSize {
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
                                padding-right: $largePadding;
                                padding-bottom: smallPadding;
                                height: $titleHeight;

                                .pl-step-title-line {
                                    height: 1px;
                                    flex: 1;
                                    background-color: plVar(colorContentSub);
                                }
                            }

                            .pl-step-title, .pl-step-content {
                                padding: 0 $largePadding;
                                box-sizing: border-box;
                                letter-spacing: 1px;
                                color: inherit;
                            }

                            .pl-step-content {
                                font-size: $contentFontSize;
                            }
                        }

                        .pl-step-icon-wrapper {
                            height: $titleHeight;
                            width: $titleHeight;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: inherit;

                            .pl-icon {
                                font-size: $iconFontSize;
                            }
                        }

                        .pl-step-number {
                            height: $numberSize;
                            width: $numberSize;
                            border-radius: $numberSize;
                            border: solid 1px plVar(colorContentSub);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: inherit;
                        }
                    }
                }
            }

            .pl-step.pl-step-active {
                color: plVar(colorPrimaryDeep) !important;

                .pl-step-number {
                    border-color: plVar(colorPrimaryDeep) !important;;
                }

                .pl-step-title-line {
                    background-color: plVar(colorPrimaryDeep) !important;;
                }
            }

            .pl-step.pl-step-complete, .pl-step.pl-step-status-success {
                color: plVar(colorSuccessDeep) !important;;

                .pl-step-number {
                    border-color: plVar(colorSuccessDeep) !important;;
                }

                .pl-step-title-line {
                    background-color: plVar(colorSuccessDeep) !important;;
                }
            }

            .pl-step.pl-step-status-error {
                color: plVar(colorErrorDeep) !important;;

                .pl-step-number {
                    border-color: plVar(colorErrorDeep) !important;;
                }

                .pl-step-title-line {
                    background-color: plVar(colorErrorDeep) !important;;
                }
            }

        }
    }
</style>