export const ValueMixin = {
    props: {
        value: {},
    },
    watch: {
        value(val) {
            this.p_watchValue && val !== this.p_value && (this.p_value = val)
        },
    },
    data() {
        return {
            p_value: this.value,
            p_watchValue: true,
        }
    },
    methods: {
        p_emitValue() {
            this.$emit('input', this.p_value)
        },
    },
}

export const EditMixin = {
    props: {
        disabled: {type: Boolean, default: null},                       //是否禁用
        readonly: {type: Boolean, default: null},                       //是否只读
        required: {type: Boolean, default: null},                       //是否必输
        rules: {},                                                      //校验规则
        validFunc: {type: Function},                                    //自定义验证函数
        validOnInit: {type: Boolean},                                   //是否在初始化的时候进行校验
    },
    watch: {
        disabled(val) {
            this.p_disabled !== val && (this.p_disabled = val)
        },
        readonly(val) {
            this.p_readonly !== val && (this.p_readonly = val)
        },
    },
    data() {
        return {
            p_disabled: this.disabled,
            p_readonly: this.readonly,

            isValid: true,
        }
    },
    computed: {
        editBinding() {
            const props = [
                'p_disabled',
                'p_readonly',
                'disabled',
                'readonly',
                'required',
                'rules',
                'validFunc',
                'validOnInit',
            ]
            return props.reduce((ret, item) => {
                ret[item] = this[item]
                return ret
            }, {})
        },
        editListening() {
            return {
                'update:isValid': (val) => this.isValid = val,
                'update:p_disabled': (val) => this.p_disabled = val,
                'update:p_readonly': (val) => this.p_readonly = val,
            }
        },
    },
}

export const SimpleEditMixin = {
    props: {
        disabled: {type: Boolean, default: null},                       //是否禁用
        readonly: {type: Boolean, default: null},                       //是否只读
        required: {type: Boolean, default: null},                       //是否必输
        validOnInit: {type: Boolean, default: null},                       //是否必输
    },
    computed: {
        simpleBinding() {
            return {
                readonly: this.readonly,
                disabled: this.disabled,
                required: this.required,
                validOnInit: this.validOnInit,
            }
        },
    },
}

export const MountedMixin = {
    data() {
        return {
            p_mounted: false
        }
    },
    mounted() {
        this.p_mounted = true
        this.$emit('mounted', this)
    },
    beforeDestroy() {
        this.p_mounted = false
        this.$emit('destroyed', this)
    },
}

export const ThrottleMixin = {
    props: {
        throttleSync: {type: Boolean,},
        throttleTime: {type: Number,},
    },
    data() {
        return {
            p_throttleLoading: null,
        }
    },
    methods: {
        async pl_throttle(e, func) {
            if (this.throttleTime == null && !this.throttleSync) {
                func(e)
            } else {
                if (!!this.p_throttleLoading) return
                this.p_throttleLoading = true
                await Promise.all([this.pl_waitTime(this.throttleTime), this.pl_waitFunc(e, func)])
                this.p_throttleLoading = false
            }
        },
        async pl_waitTime(time) {
            time != null && await this.$plain.$utils.delay(time)
        },
        async pl_waitFunc(e, func) {
            !!func && await func(e)
        },
        throttle(param, callback, time = 500) {
            if (!!this.p_throttleTimer) clearTimeout(this.p_throttleTimer)
            this.p_throttleTimer = setTimeout(() => {
                callback(param)
                this.p_throttleTimer = null
            }, time)
        },
    }
}


