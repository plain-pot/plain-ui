import {Cascade} from "./index";

const DEFAULT_OPTION = {
    reference: null,
    private: false,
}

const DEFAULT_POPPER_OPTION = {
    placement: 'bottom-start',
    trigger: 'manual',
    transition: 'pl-transition-popper-drop',
    arrow: false,
}

export default {
    name: 'pl-cascade-service',
    data() {
        const showFlag: boolean = false
        const openFlag: boolean = false
        const cascade: Cascade = null

        return {
            showFlag,
            openFlag,
            cascade,
            count: 0,
        }
    },
    render(h) {
        return (
            <pl-popper
                class="pl-cascade-service"
                {...this.popperBinding}
            >
                <pl-cascade-panel slot="popper"
                                  key={this.count}
                                  value={this.p_opts.value}
                                  onChange={this.onChange}
                                  {...{props: this.p_opts}}
                />
            </pl-popper>
        )
    },
    computed: {
        isPrivate() {
            if (!this.cascade) return false
            return this.p_opts.private
        },
        isShow() {
            return this.showFlag
        },
        isOpen() {
            return this.openFlag
        },
        p_opts() {
            if (!this.cascade) return {}
            let option = this.cascade.option
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
                    popperClass: 'pl-cascade-service-popper',
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

                        this.cascade.ins = null
                        this.cascade = null
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
            if (!!this.cascade.option.beforeShow) await this.cascade.option.beforeShow()
            this.showFlag = true
        },
        async hide() {
            if (!this.showFlag) return
            if (!!this.cascade.option.beforeHide) await this.cascade.option.beforeHide()
            this.showFlag = false
        },
        bind(cascade) {
            if (!!this.cascade) {
                this.cascade.ins = null
            }
            this.cascade = cascade
            cascade.ins = this
        },
        unbind(cascade) {
            if (cascade === this.cascade) {
                this.cascade = null
            }
            cascade.ins = null
        },

        onChange(val) {
            if (!!this.p_opts && !!this.p_opts.on && !!this.p_opts.on.change) {
                this.p_opts.on.change(val)
            }
            this.hide()
        },
    },
}