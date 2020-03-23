<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";
    import DropdownWrapper from './pl-dropdown-wrapper'

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
            const that = this
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
                                <DropdownWrapper {...that.wrapperBinding}>
                                    {!this.p_height ?
                                        content :
                                        <pl-scroll>
                                            {content}
                                        </pl-scroll>
                                    }
                                </DropdownWrapper>
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
                if (!this.service) {
                    console.log('no service')
                    return false
                } else {
                    console.log('this.service', this.service)
                    return this.service.isShow()
                }
            },
            isOpen() {
                if (!this.service) return false
                return this.service.isOpen()
            },
            wrapperBinding() {
                return {
                    style: {
                        ...(!this.p_width ? {} : {width: this.$plain.utils.suffixPx(this.p_width)}),
                        ...(!this.p_height ? {} : {height: this.$plain.utils.suffixPx(this.p_height)}),
                    },
                    on: {
                        'click-item': (data) => {
                            this.onClickItem(data)
                        },
                    },
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
            /*---------------------------------------handler-------------------------------------------*/
            onClickItem() {
                this.hide()
            },
        },
    }
</script>

<style lang="scss">
</style>