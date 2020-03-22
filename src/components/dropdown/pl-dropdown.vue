<script>
    export default {
        name: "pl-dropdown",
        props: {},
        data() {
            return {
                service: null,
                popperOption: {
                    reference: () => this.$el,
                    popperProps:{
                        noContentPadding: true,
                    },
                    render: (h) => {
                        if (!!this.$slots.dropdown) {
                            return (
                                <div>
                                    {this.$slots.dropdown}
                                </div>
                            )
                        }
                        if (!!this.$scopedSlots.default) {
                            return this.$scopedSlots.default()
                        }
                    },
                },
            }
        },
        computed: {
            isShow() {
                if (!this.service) return false
                return this.service.isShow()
            },
            isOpen() {
                if (!this.service) return false
                return this.service.isOpen()
            },
        },
        render() {
            return this.$slots.default[0]
        },
        methods: {
            async show() {
                if (this.isShow) return
                if (!this.service) {
                    this.service = await this.$popper(this.popperOption)
                }
                this.service.show()
            },
            hide() {
                if (!this.isShow) return
                this.service.hide()
            },
            toggle() {
                if (!this.isShow) {
                    this.show()
                } else {
                    this.hide()
                }
            },
        },
    }
</script>

<style lang="scss">
</style>