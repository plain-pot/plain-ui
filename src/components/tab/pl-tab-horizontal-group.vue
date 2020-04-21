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
                className: 'pl-tab-horizontal-group',
            }
        },
        render() {

            return (
                <div class={this.classes}>

                    <div class="pl-tab-horizontal-head-wrapper">
                        <pl-scroll scrollX={true} scrollY={false}>
                            <ul class="pl-tab-horizontal-head">
                                {this.items.map(item => (
                                    <li class="pl-tab-horizontal-head-item">
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </pl-scroll>
                    </div>

                    <ul class="pl-tab-horizontal-list">
                        {this.items.map(item => item.$slots.default).flat().map(item => (
                            <li class="pl-tab">
                                {item}
                            </li>
                        ))}
                    </ul>
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
                height: 40px;
                overflow: hidden;
                border-bottom: solid 2px $ibl;
            }

            .pl-tab-horizontal-head {
                height: 40px;

                .pl-tab-horizontal-head-item {
                    height: 40px;
                    line-height: 40px;
                    cursor: pointer;

                    &:not(:first-child) {
                        margin-left: 16px;
                    }

                    &:hover {
                        color: $colorPrimary;
                    }
                }
            }
        }
    }
</style>