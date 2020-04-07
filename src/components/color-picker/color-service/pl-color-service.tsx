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
            count: 0,
        }
    },
    render(h) {
        return (
            <pl-popper
                class="pl-color-service"
                {...this.popperBinding}
            >
                <pl-color-panel slot="popper"
                                key={this.count}
                                value={this.p_opts.value}
                                enableAlpha={this.p_opts.enableAlpha}
                                format={this.p_opts.format}
                                onChange={this.onChange}
                />
            </pl-popper>
        )
    },
    computed: {
        isPrivate() {
            if (!this.color) return false
            return this.p_opts.private
        },
        isShow() {
            return this.showFlag
        },
        isOpen() {
            return this.openFlag
        },
        enableAlpha() {
            if (!this.color) return undefined
            if (this.p_opts.enableAlpha !== null) return this.p_opts.enableAlpha
            if (this.p_opts.value == null) return false
            return this.p_opts.value.indexOf('rgba') > -1
        },
        format() {
            if (!this.color) return undefined
            if (this.p_opts.format !== null) return this.p_opts.format
            if (this.p_opts.value == null) return 'hex'
            return (this.enableAlpha || this.p_opts.value.indexOf('rgb') > -1) ? 'rgb' : 'hex'
        },
        p_opts() {
            if (!this.color) return {}
            let option = this.color.option
            if (typeof option === 'function') {
                option = option()
            }

            let popperOption = {
                ...DEFAULT_POPPER_OPTION,
                ...(option.popperProps || {}),
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
                    reference: this.p_opts.reference,
                    popperClass: 'pl-color-service-popper',
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
                    ['click-body']: () => {
                        if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.clickBody) {
                            this.p_opts.on.clickBody()
                        }
                        if (!!this.isShow) {
                            this.hide()
                        }
                    },
                    ['mousedown-popper']: () => {
                        if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.mousedownPopper) {
                            this.p_opts.on.mousedownPopper()
                        }
                    },
                    ['click-popper']: () => {
                        if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.clickPopper) {
                            this.p_opts.on.clickPopper()
                        }
                    },
                },
            }
        },
    },
    methods: {
        async show() {
            if (!!this.showFlag) return
            this.count++
            await this.$plain.nextTick()
            if (!!this.color.option.beforeShow) await this.color.option.beforeShow()
            this.showFlag = true
        },
        async hide() {
            if (!this.showFlag) return
            if (!!this.color.option.beforeHide) await this.color.option.beforeHide()
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

        onChange(val) {
            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.change) {
                this.p_opts.on.change(val)
            }
            this.hide()
        },
    },
}