<script>
    import {MountedMixin} from "../../utils/mixins";

    export default {
        name: "pl-tab-group-inner-tab",
        mixins: [
            MountedMixin,
        ],
        inject: {
            plTabGroup: {default: null}
        },
        props: {
            item: {},
            horizontal: {type: Boolean},
        },
        data() {
            return {
                init: false,
                isShow: false,
            }
        },
        computed: {},
        created() {
            this.unwatch = this.$watch('plTabGroup.p_value', {
                immediate: true,
                handler: (val) => {
                    const flag = val === this.item.tabId

                    if (this.horizontal) {
                        this.isShow = flag
                    } else {
                        if (flag === true && !this.isShow) {
                            setTimeout(() => this.isShow = true, 23)
                        } else {
                            this.isShow = flag
                        }
                    }
                },
            })
        },
        beforeDestroy() {
            if (!!this.unwatch) {
                this.unwatch()
            }
        },
        render() {
            if (!this.isMounted) return null
            const {isShow, init} = this

            if (isShow && !init) {
                setTimeout(() => this.init = true)
                return null
            } else {
                const directives = [
                    {name: 'show', value: this.isShow}
                ]
                return (
                    <transition name="pl-transition-tab">
                        <div class="pl-tab" {...{directives}}>
                            {!!init && this.item.$slots.default}
                        </div>
                    </transition>
                )
            }
        },
    }
</script>

<style lang="scss">

</style>