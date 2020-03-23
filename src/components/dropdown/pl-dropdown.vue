<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-dropdown",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                width: PropsMixinFactory.Number,
                height: PropsMixinFactory.Number,
            }),
        ],
        props: {
            trigger: {type: String, default: 'click'},                      // click, focus, hover, manual
            width: {type: [String, Number]},
            height: {type: [String, Number]},

        },
        data() {
            return {
                service: null,
                popperOption: {
                    reference: () => this.$el,
                    popperProps: {
                        noContentPadding: true,
                    },
                    render: (h) => {

                        const wrapper = (content) => {
                            return (
                                <div style={this.wrapperStyle}>
                                    {!this.p_height ?
                                        content :
                                        <pl-scroll>
                                            {content}
                                        </pl-scroll>
                                    }
                                </div>
                            )
                        }

                        if (!!this.$slots.dropdown) {
                            return wrapper(this.$slots.dropdown)
                        }
                        if (!!this.$scopedSlots.default) {
                            return wrapper(this.$scopedSlots.default())
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
            wrapperStyle() {
                return {
                    ...(!this.p_width ? {} : {width: this.$plain.utils.suffixPx(this.p_width)}),
                    ...(!this.p_height ? {} : {height: this.$plain.utils.suffixPx(this.p_height)}),
                }
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
                console.log('show')
                this.service.show()
            },
            hide() {
                if (!this.isShow) return
                console.log('hide')
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