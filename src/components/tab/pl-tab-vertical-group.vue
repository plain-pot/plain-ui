<script>
    import {TabMixin, TabProps} from "./tab";
    import {MountedMixin} from "../../utils/mixins";

    export default {
        name: "pl-tab-vertical-group",
        mixins: [
            TabMixin,
            MountedMixin,
        ],
        props: {
            ...TabProps,
        },
        data() {
            return {
                groupClass: 'pl-tab-vertical-group',
            }
        },
        render() {
            return (
                <div class={this.classes}>
                    <div class="pl-tab-vertical-head-wrapper">
                        <pl-scroll>
                            <ul class="pl-tab-vertical-head">
                                {this.items.map(item => (
                                    <li class={[
                                        'pl-tab-vertical-head-item',
                                        {
                                            'pl-tab-vertical-head-item-active': item.tabId === this.plTabGroup.p_value
                                        }
                                    ]}
                                        onClick={() => this.plTabGroup.onClickTabTitle(item)}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </pl-scroll>
                    </div>
                    <ul class="pl-tab-vertical-list">
                        {this.items.map(item => (
                            <pl-tab-group-inner-tab key={item.tabId} item={item}/>
                        ))}
                    </ul>
                </div>
            )
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tab-vertical-group {
            display: inline-block;
            width: 100%;
            height: inherit;

            .pl-tab-vertical-head-wrapper {
                height: 100%;
                overflow-y: hidden;

                .pl-tab-vertical-head {
                    .pl-tab-vertical-head-item {
                        padding: 0 12px;
                        line-height: 32px;
                        transition: all 300ms $transition;
                    }
                }
            }

            .pl-tab-vertical-head, .pl-tab-vertical-list {
                margin: 0;
                padding: 0;
                list-style: none;
            }

            &.pl-tab-group-position-left {
                .pl-tab-vertical-head-wrapper {
                    float: left;
                    position: relative;
                    margin-right: 20px;

                    &:before {
                        position: absolute;
                        content: '';
                        top: 0;
                        bottom: 0;
                        right: 0;
                        width: 2px;
                        background-color: $ibl;
                    }

                    .pl-tab-vertical-head {
                        .pl-tab-vertical-head-item {
                            text-align: right;

                            border-right: solid 2px transparent;
                            cursor: pointer;

                            &.pl-tab-vertical-head-item-active {
                                background-color: rgba($colorPrimary, 0.1);
                                border-right-color: $colorPrimary;
                            }
                        }
                    }
                }
            }

            &.pl-tab-group-position-right {
                .pl-tab-vertical-head-wrapper {
                    float: right;
                    position: relative;
                    margin-left: 20px;

                    &:before {
                        position: absolute;
                        content: '';
                        top: 0;
                        bottom: 0;
                        left: 0;
                        width: 2px;
                        background-color: $ibl;
                    }

                    .pl-tab-vertical-head {
                        .pl-tab-vertical-head-item {
                            text-align: left;

                            border-left: solid 2px transparent;
                            cursor: pointer;

                            &.pl-tab-vertical-head-item-active {
                                background-color: rgba($colorPrimary, 0.1);
                                border-left-color: $colorPrimary;
                            }
                        }
                    }
                }
            }


        }
    }
</style>