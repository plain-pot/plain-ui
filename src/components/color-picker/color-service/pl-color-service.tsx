import {Color} from "./index";

const DEFAULT_OPTION = {
    reference: null,
    private: false,
}

const DEFAULT_POPPER_OPTION = {
    placement: 'bottom-start',
    trigger: 'manual',
    transition: 'pl-transition-scale',
}

export default {
    name: "pl-color-service",
    props: {},
    data() {
        const showFlag: boolean = false
        const openFlag: boolean = false
        const color: Color = null

        return {
            showFlag,
            openFlag,
            color,
        }
    },
    render(h) {
        return (
            <pl-popper
                class="pl-color-service"
                v-model={this.showFlag}
                open={this.openFlag}
                trigger="manual"
                reference={this.color.option.reference}
            >
                <pl-color-panel/>
            </pl-popper>
        )
    },
    computed: {
        isPrivate() {
            if (!this.option) return false
            return this.p_opts.private
        },
        isShow() {
            return this.showFlag
        },
        isOpen() {
            return this.openFlag
        },
        p_opts() {
            if (!this.color) return null
            let option = this.color.option
            let popperOption = {
                ...DEFAULT_POPPER_OPTION,
                ...(option.popperProps|| {})
            }

            option = {
                ...DEFAULT_OPTION,
                ...option,
                popperOption,
            }
            return option
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

                        this.color.ins = null
                        this.color = null
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
    methods: {
        async show() {
            if (!!this.showFlag) return
            await this.$plain.nextTick()
            if (!!this.color.option.beforeShow) await this.select.option.beforeShow()
            this.showFlag = true
        },
        async hide() {
            if (!this.showFlag) return
            if (!!this.select.option.beforeHide) await this.select.option.beforeHide()
            this.showFlag = false
        },
        bind(color) {
            if (!!this.color) {
                this.color.ins = null
            }
            this.color = color
            color.ins = this
        },
        unbind(color) {
            if (color === this.color) {
                this.color = null
            }
            color.ins = null
        },
    },
}