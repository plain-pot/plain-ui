<script>
    import {EmitMixin} from "../../utils/mixins";
    import {TabProps} from "./tab";
    import PlTabHorizontalGroup from "./pl-tab-horizontal-group";
    import PlTabVerticalGroup from "./pl-tab-vertical-group";

    export default {
        name: "pl-tab-group",
        components: {PlTabVerticalGroup, PlTabHorizontalGroup},
        props: {
            ...TabProps,
        },
        mixins: [
            EmitMixin,
        ],
        emitters: {
            emitInput: Function,
        },
        render() {
            return (
                <div class="pl-tab-group">
                    {this.position === 'top' || this.position === 'bottom' ? (
                        <pl-tab-horizontal-group {...this.binding}/>
                    ) : (
                        <pl-tab-vertical-group {...this.binding}/>
                    )}
                </div>
            )
        },
        computed: {
            binding() {
                return {
                    props: Object.keys(TabProps).reduce((ret, key) => {
                        ret[key] = this[key]
                        return ret
                    }, {}),
                    on: {
                        change(val) {
                            this.emitInput(val)
                        },
                    },
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tab-group {

            .pl-tab-head, .pl-tab-body {
                margin: 0;
                padding: 0;
                list-style: none;

                & > li {
                    display: inline-block;
                }
            }

            &.pl-tab-group-position-top, &.pl-tab-group-position-bottom {
                position: relative;

                .pl-tab-head-wrapper {
                    width: 100%;
                    left: 0;
                    right: 0;
                    position: absolute;

                    & > .pl-scroll {
                        & > .pl-horizontal-scrollbar-wrapper {
                            bottom: 12px;
                        }
                    }
                }

                .pl-tab-body {
                    padding: 20px 0;
                    width: 100%;
                    height: 100%;
                }

                .pl-tab-head-bottom {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: $ibl;
                }

                .pl-tab-head {
                    white-space: nowrap;
                    display: inline-block;
                    position: relative;
                    min-width: 100%;

                    .pl-tab-head-item {
                        padding: 12px 0;
                        font-size: 14px;
                        color: $itc;
                        cursor: pointer;
                        user-select: none;

                        &:hover {
                            color: $colorPrimary;
                        }

                        &.pl-tab-head-item-current {
                            color: $colorPrimary;
                        }

                        &:not(:first-child) {
                            margin-left: 16px;
                        }
                    }

                    .pl-tab-head-indicator {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 2px;
                        background-color: $colorPrimary;
                        transition: all 500ms $transition;
                    }
                }


                &.pl-tab-group-position-top {
                    .pl-tab-head-wrapper {
                        top: 0;

                        .pl-tab-head-bottom {
                            bottom: 20px;
                        }
                    }

                    &.pl-tab-group-type-card, &.pl-tab-group-type-card-border {
                        border-radius: 2px;

                        .pl-tab-head-item {
                            padding-left: 20px;
                            padding-right: 20px;

                            border-top: solid 1px $ibl;
                            border-right: solid 1px $ibl;
                            border-bottom: solid 1px $ibl;

                            transition: background-color 300ms $transition;
                            background-color: #f6f6f6;

                            &:not(:first-child ) {
                                margin-left: 0;
                            }

                            &:first-child {
                                border-left: solid 1px $ibl;
                                border-top-left-radius: 2px;
                            }

                            &:last-child {
                                border-top-right-radius: 2px;
                            }

                            &.pl-tab-head-item-current {
                                background-color: white;
                            }
                        }

                        .pl-tab-head-bottom {
                            height: 1px;
                        }
                    }

                    &.pl-tab-group-type-card-border {
                        box-shadow: $boxshadow;

                        .pl-tab-head {
                            background-color: #f6f6f6;
                        }

                        .pl-tab-head-item {
                            border-top: none;

                            &:first-child {
                                border-left: none;
                            }

                            &.pl-tab-head-item-current {
                                border-bottom-color: white;
                            }

                        }

                        .pl-tab-body {
                            padding-left: 12px;
                            padding-right: 12px;
                        }
                    }
                }

                &.pl-tab-group-position-bottom {
                    .pl-tab-head-wrapper {
                        bottom: -20px;

                        .pl-tab-head-bottom {
                            top: 0;
                        }

                        .pl-tab-head-indicator {
                            top: 0;
                        }
                    }

                    &.pl-tab-group-type-card, &.pl-tab-group-type-card-border {
                        border-radius: 2px;

                        .pl-tab-head-item {
                            padding-left: 20px;
                            padding-right: 20px;

                            border-bottom: solid 1px $ibl;
                            border-right: solid 1px $ibl;
                            border-top: solid 1px $ibl;

                            transition: background-color 300ms $transition;
                            background-color: #f6f6f6;

                            &:not(:first-child ) {
                                margin-left: 0;
                            }

                            &:first-child {
                                border-left: solid 1px $ibl;
                                border-bottom-left-radius: 2px;
                            }

                            &:last-child {
                                border-bottom-right-radius: 2px;
                            }

                            &.pl-tab-head-item-current {
                                background-color: white;
                            }
                        }

                        .pl-tab-head-bottom {
                            height: 1px;
                        }
                    }

                    &.pl-tab-group-type-card-border {
                        box-shadow: $boxshadow;

                        .pl-tab-head {
                            background-color: #f6f6f6;
                        }

                        .pl-tab-head-item {
                            border-bottom: none;

                            &:first-child {
                                border-left: none;
                            }

                            &.pl-tab-head-item-current {
                                border-top-color: white;
                            }

                        }

                        .pl-tab-body {
                            padding-left: 12px;
                            padding-right: 12px;
                        }
                    }
                }
            }

            &.pl-tab-group-position-left, &.pl-tab-group-position-right {
                .pl-tab-head-wrapper {
                    height: 100%;
                    position: relative;

                    .pl-tab-head {
                        position: relative;

                        .pl-tab-head-item {
                            display: block;
                            text-align: right;
                            cursor: pointer;
                            line-height: 2em;
                            transition: background-color 300ms $transition;

                            &:hover {
                                color: $colorPrimary;
                            }

                            &.pl-tab-head-item-current {
                                color: $colorPrimary;
                                background-color: rgba($colorPrimary, 0.1);
                            }
                        }

                        .pl-tab-head-indicator {
                            position: absolute;
                            right: 1px;
                            top: 0;
                            width: 2px;
                            background-color: $colorPrimary;
                            transition: all 500ms $transition;
                        }
                    }

                    .pl-tab-head-bottom {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 2px;
                        background-color: $ibl;
                    }
                }

                &.pl-tab-group-position-left {
                    .pl-tab-head-wrapper {
                        float: left;
                        margin-right: 20px;

                        .pl-tab-head-bottom {
                            right: 1px;
                        }

                        .pl-tab-head-item {
                            padding-right: 12px;
                        }
                    }
                }

                &.pl-tab-group-position-right {
                    .pl-tab-head-wrapper {
                        float: right;

                        .pl-tab-head-bottom {
                            left: 1px;
                        }

                        .pl-tab-head-item {
                            text-align: left;
                            padding-left: 12px;
                        }

                        .pl-tab-head-indicator {
                            right: auto;
                            left: 1px;
                            top: 0;
                        }
                    }
                }
            }
        }
    }
</style>