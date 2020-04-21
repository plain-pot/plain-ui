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
        render() {

            return (
                <div class="pl-tab-horizontal-group">
                    <div class="pl-tab-horizontal-head">
                        {this.items.map(item => (
                            <div class="pl-tab-horizontal-head-item">
                                {item.title}
                            </div>
                        ))}
                    </div>

                    <div class="pl-tab-horizontal-list">
                        {this.items.map(item => item.$slots.default).flat().map(item => (
                            <div class="pl-tab">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
    }

</script>

<style lang="scss">
    @include themify {
        .pl-tab-horizontal-group {

        }
    }
</style>