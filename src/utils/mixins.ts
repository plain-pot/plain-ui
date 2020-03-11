export const MountedMixin = {
    data() {
        return {
            isMounted: false,
        }
    },
    mounted() {
        this.isMounted = true
    }
}


export const RefsMixinFactory = function (option) {
    const refs = Object.keys(option).reduce((ret, key) => {
        const ref = option[key] || {}
        if (ref.cache == undefined) ref.cache = false
        if (ref.get == undefined) ref.get = function () {
            return this.$refs[key]
        }
        if (ref.set == undefined) ref.set = function () {
            return console.error(`请不要对 ref 设值: ${key}}`)
        }
        ret[key] = {...ref}
        return ret
    }, {})
    return {
        computed: refs
    }
}

export const EditMixin = {
    inject: {
        plParentEditor: {default: null},
    },
    provide() {
        return {
            plParentEditor: this
        }
    },
    props: {
        disabled: {type: Boolean, default: null},
        readonly: {type: Boolean, default: null},
    },
    computed: {
        isDisabled() {
            if (this.disabled !== null) return this.disabled
            else if (!!this.plParentEditor) return this.plParentEditor.isDisabled
            return false
        },
        isReadonly() {
            if (this.readonly !== null) return this.readonly
            else if (!!this.plParentEditor) return this.plParentEditor.isReadonly
            return false
        },
        isEditable() {
            return !this.isDisabled && !this.isReadonly
        },
    },
    created() {
        this.$on('change', (...args) => !!this.plParentEditor.isFormItem && this.plParentEditor.onChange(...args))
        this.$on('blur', (...args) => !!this.plParentEditor.isFormItem && this.plParentEditor.onBlur(...args))
    },
}

export const EmitMixin = {
    data() {
        const emitters = this.$options.emitters || {}
        const emitter = Object.keys(emitters).reduce((ret, name) => {
            const kebabCaseName = this.$plain.utils.kebabCase(name).replace('emit-', '').replace('update-', 'update:')
            // console.log(name, kebabCaseName)
            ret[name] = name === 'emitInput' ?
                (val) => {
                    this.$emit('input', val)
                    this.$emit('change', val)
                } :
                (...args) => this.$emit(kebabCaseName, ...args)
            return ret
        }, {})
        // console.log(emitter)
        return {
            ...emitter,
        }
    },
}

export const PropsMixin = (config) => {
    return {
        watch: Object.keys(config).reduce((ret, propName) => {
            const check = Array.isArray(config[propName]) ? config[propName] : [config[propName]]
            ret[propName] = {
                immediate: true,
                async handler(val) {
                    if (val != null) {
                        if (check.indexOf(PropsMixin.Promise) > -1 && !!val.then && typeof val.then === 'function') {
                            val = await val
                        }
                        if (check.indexOf(PropsMixin.Function) > -1 && typeof val === 'function') {
                            val = val(this)
                        }
                        if (check.indexOf(PropsMixin.Number) > -1) {
                            if (typeof val === 'string') {
                                val = !!val ? Number(val.replace('px', '')) : null
                            }
                        }
                    }
                    this[`p_${propName}`] = val
                    this.$emit(`change:${propName}`, val)
                },
            }
            return ret
        }, {}),
        data() {
            const ret = Object.keys(config).reduce((ret, propName) => {
                ret[`p_${propName}`] = null
                return ret
            }, {})
            return {
                ...ret,
            }
        },
    }
}
PropsMixin.Promise = 'Promise'
PropsMixin.Number = 'Number'
PropsMixin.Function = 'Function'
PropsMixin.ALL = [PropsMixin.Promise, PropsMixin.Number, PropsMixin.Function]