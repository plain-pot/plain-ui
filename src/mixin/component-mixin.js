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
        required: {type: Boolean},                                      //是否必输
        rules: {type: Array},                                           //校验规则
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
    },
    beforeDestroy() {
        this.p_mounted = false
    },
}

export const ThrottleMixin = {
    props: {
        duration: {type: Number, default: 500},                         //防止快速点击时间间隔
    },
    data() {
        return {
            timerWait: null,
            timerHandler: null,
        }
    },
    methods: {
        pl_throttle(e, func) {
            if (!!this.timerWait || !!this.timerHandler) return
            this.timerWait = setTimeout(() => {
                this.timerWait = null
            }, this.duration)

            this.timerHandler = setTimeout(async () => {
                !!func && (await func(e))
                this.timerHandler = null
            }, 0)
        },
    }
}


