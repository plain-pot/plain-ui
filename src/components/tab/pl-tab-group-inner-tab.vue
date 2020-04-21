<script>
    export default {
        name: "pl-tab-group-inner-tab",
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
            const directives = [
                {name: 'show', value: this.isShow}
            ]
            return (
                <div class="pl-tab" {...{directives}}>
                    {this.item.$slots.default}
                </div>
            )
        },
    }
</script>

<style lang="scss">

</style>