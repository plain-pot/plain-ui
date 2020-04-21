<script>

    import {TabMixin, TabProps} from "./tab";
    import {MountedMixin} from "../../utils/mixins";

    export default {
        name: 'pl-tab-horizontal-group',
        mixins: [
            TabMixin,
            MountedMixin,
        ],
        props: {
            ...TabProps,
        },
        data() {
            return {
                groupClass: 'pl-tab-horizontal-group',
            }
        },
        render() {

            const head = (
                <div class="pl-tab-horizontal-head-wrapper">
                    <pl-scroll scrollX={true} scrollY={false} scrollbarSize={4} ref="scroll">
                        <ul class="pl-tab-horizontal-head" onMousewheel={this.onMousewheelHeadList}>
                            {this.items.map(item => (
                                <li class={[
                                    'pl-tab-horizontal-head-item',
                                    {
                                        'pl-tab-horizontal-head-item-active': item.tabId === this.plTabGroup.p_value
                                    }
                                ]}
                                    onClick={() => this.plTabGroup.onClickTabTitle(item)}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    </pl-scroll>
                </div>
            )

            const body = (
                <ul class="pl-tab-horizontal-list">
                    {this.items.map(item => (
                        <pl-tab-group-inner-tab key={item.tabId} item={item}/>
                    ))}
                </ul>
            )

            return (
                <div class={this.classes}>
                    {this.position === 'top' ? [head, body] : [body, head]}
                </div>
            )
        },
    }

</script>

<style lang="scss">
    @include themify {
        .pl-tab-horizontal-group {
            .pl-tab-horizontal-head, .pl-tab-horizontal-list {
                margin: 0;
                padding: 0;
                list-style: none;

                & > li {
                    display: inline-block;
                }
            }

            .pl-tab-horizontal-head-wrapper {
                height: 44px;
                overflow: hidden;
                box-sizing: border-box;
            }

            .pl-tab-horizontal-head {
                height: 40px;
                display: inline-block;
                white-space: nowrap;

                .pl-tab-horizontal-head-item {
                    height: 40px;
                    line-height: 40px;
                    cursor: pointer;
                    font-size: 14px;
                    color: $ihc;

                    &:hover {
                        color: $colorPrimary;
                    }
                }
            }

            .pl-tab-horizontal-list {
                padding: 20px 0;
            }

            &.pl-tab-group-position-top, &.pl-tab-group-position-bottom {
                .pl-tab-horizontal-head-wrapper {
                    .pl-scroll-content {
                        min-width: 100%;
                    }
                }
            }

            &.pl-tab-group-card-default {
                .pl-tab-horizontal-head-wrapper {
                    .pl-scroll-content {
                        position: relative;

                        &:before {
                            position: absolute;
                            left: 0;
                            right: 0;
                            content: '';
                            background: $ibl;
                            height: 2px;
                            min-width: 100%;
                        }
                    }

                    .pl-horizontal-scrollbar {
                        bottom: 0;
                    }
                }

                .pl-tab-horizontal-head-item {
                    position: relative;

                    &:after {
                        position: absolute;
                        content: '';
                        left: 50%;
                        right: 50%;
                        height: 2px;
                        background-color: $colorPrimary;
                        transition: all 500ms $transition;
                    }

                    &:not(:first-child) {
                        margin-left: 32px;
                    }

                    &.pl-tab-horizontal-head-item-active {
                        color: $colorPrimary;

                        &:after {
                            left: 0;
                            right: 0;
                        }
                    }
                }

                &.pl-tab-group-position-top {
                    .pl-scroll-content {
                        &:before {
                            bottom: 4px;
                        }
                    }

                    .pl-tab-horizontal-head-item {
                        &:after {
                            bottom: 0;
                        }
                    }
                }

                &.pl-tab-group-position-bottom {
                    .pl-scroll-content {
                        &:before {
                            top: 0;
                        }
                    }

                    .pl-tab-horizontal-head-item {
                        &:after {
                            top: 0;
                        }
                    }
                }
            }

            &.pl-tab-group-card-title {
                .pl-tab-horizontal-head-wrapper {
                    .pl-scroll-content {
                        padding-top: 3px;
                        position: relative;

                        &:after {
                            position: absolute;
                            left: 0;
                            right: 0;
                            bottom: 1px;
                            background: $ibc;
                            height: 1px;
                            content: '';
                        }
                    }

                    .pl-tab-horizontal-head {
                        border-top: solid 1px $ibc;
                        border-left: solid 1px $ibc;
                        border-right: solid 1px $ibc;
                        border-top-left-radius: 2px;
                        border-top-right-radius: 2px;
                        box-sizing: border-box;

                        .pl-tab-horizontal-head-item {
                            padding: 0 20px;
                            background-color: #f9f9f9;
                            color: $ipc;
                            transition: all 300ms $transition;

                            &:not(:last-child) {
                                border-right: solid 1px $ibc;
                            }

                            &.pl-tab-horizontal-head-item-active {
                                background-color: white;
                                color: $colorPrimary;
                            }
                        }
                    }
                }
            }

            &.pl-tab-group-card-border {

            }
        }
    }
</style>