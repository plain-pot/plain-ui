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
        },
        data() {
            return {
                init: false,
            }
        },
        computed: {
            isShow() {
                return this.item.tabId === this.plTabGroup.p_value
            },
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
                    <div class="pl-tab" {...{directives}}>
                        {!!init && this.item.$slots.default}
                    </div>
                )
            }
        },
    }
</script>

<style lang="scss">

</style>