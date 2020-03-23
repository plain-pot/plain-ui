<script>

    const DEFAULT_OPTION = {
        reference: null,
        $slots: null,
        render: null,
        private: false,
    }

    const DEFAULT_POPPER_OPTION = {
        placement: 'bottom-start',
        trigger: 'manual',
        transition: 'pl-transition-scale',
    }

    export default {
        name: "pl-popper-service-item",
        props: {},
        data() {
            return {
                option: null,
                showFlag: false,
                openFlag: false,
            }
        },
        computed: {
            isShow() {
                return this.showFlag
            },
            isOpen() {
                return this.openFlag
            },
            p_opts() {
                if (!this.option) return null
                let option = this.option.option
                let popperOption = {
                    ...DEFAULT_POPPER_OPTION,
                    ...(option.popperProps || {})
                }

                option = {
                    ...DEFAULT_OPTION,
                    ...option,
                    popperOption,
                }
                return option
            },
            isPrivate() {
                if (!this.option) return false
                return this.p_opts.private
            },
            popperBinding() {
                return {
                    props: {
                        value: this.showFlag,
                        open: this.openFlag,

                        ...this.p_opts.popperOption,
                        rootProps: {
                            private: String(this.isPrivate)
                        },
                    },
                    on: {
                        input: (val) => {
                            this.showFlag = val
                        },
                        ['update:open']: (val) => {
                            this.openFlag = val
                        },
                        close: () => {
                            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.close) {
                                this.p_opts.on.close()
                            }

                            this.option.ins = null
                            this.option = null
                        },
                        show: () => {
                            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.show) {
                                this.p_opts.on.show()
                            }
                        },
                        hide: () => {
                            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.hide) {
                                this.p_opts.on.hide()
                            }
                        },
                        open: () => {
                            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.open) {
                                this.p_opts.on.open()
                            }
                        },
                    },
                }
            },
        },
        render(h) {
            if (!this.p_opts) return null
            return (
                <pl-popper class="pl-popper-service-item"
                           reference={this.p_opts.reference}
                           {...this.popperBinding}>
                    <div slot="popper" class="pl-popper-service-item-content" private={String(this.isPrivate)}>
                        {!!this.p_opts.$slots && this.p_opts.$slots}
                        {!!this.p_opts.render && this.p_opts.render(h)}
                    </div>
                </pl-popper>
            )
        },
        methods: {
            bind(option) {
                if (!!this.option) {
                    this.option.ins = null
                }
                this.option = option
                this.option.ins = this
            },
            unbind(option) {
                if (option === this.option) {
                    this.option = null
                }
                option.ins = null
            },
            async show() {
                if (this.isShow) return
                this.showFlag = true
            },
            async hide() {
                if (!this.isShow) return
                this.showFlag = false
            },
        },
    }
</script>

<style lang="scss">
</style>