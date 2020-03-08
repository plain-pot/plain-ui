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

export const RefsMixin = {
    data() {
        const refs = this.$options.refs || {}
        const ref = {}
        Object.keys(refs).forEach(refName => {
            Object.defineProperty(ref, refName, {
                enumerable: true,
                configurable: true,
                get: () => {
                    return this.$refs[refName]
                },
                set: () => {
                    return console.error('请不要对 ref 设值')
                },
            })
        })
        return {
            ...ref,
        }
    },
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
}

export const EmitMixin = {
    data() {
        const emitters = this.$options.emitters || {}
        const emitter = Object.keys(emitters).reduce((ret, name) => {
            const kebabCaseName = this.$plain.utils.kebabCase(name).replace('emit-', '').replace('update-', 'update:')
            // console.log(name, kebabCaseName)
            ret[name] = (...args) => this.$emit(kebabCaseName, ...args)
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
        props: Object.keys(config).reduce((ret, propName) => {
            const propConfig = config[propName]
            ret[propName] = {
                type: propConfig.type,
                default: propConfig.default,
            }
            return ret
        }, {}),
        watch: Object.keys(config).reduce((ret, propName) => {
            const propConfig = config[propName]
            const check = Array.isArray(propConfig.check) ? propConfig.check : [propConfig.check]
            ret[propName] = {
                immediate: true,
                async handler(val) {
                    if (val != null) {
                        if (check.indexOf('promise') > -1 && !!val.then && typeof val.then === 'function') {
                            val = await val
                        }
                        if (propConfig.check.indexOf('function') > -1 && typeof val === 'function') {
                            val = val(this)
                        }
                        if (propConfig.check.indexOf('number') > -1) {
                            if (typeof val === 'string') {
                                val = !!val ? val.replace('px', '') : null
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