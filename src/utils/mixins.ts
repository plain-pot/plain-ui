/**
 * 用来判断是否已经挂载的mixin
 * @author  韦胜健
 * @date    2020/3/11 18:10
 */
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

/**
 * 生成refs的mixin
 * @author  韦胜健
 * @date    2020/3/11 18:10
 */
export const RefsMixinFactory = function (option) {
    const refs = Object.keys(option).reduce((ret, key) => {
        let ref = option[key] || {}
        if (ref === Object) ref = {}

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

/**
 * disabled以及readonly编辑控制的mixin
 * @author  韦胜健
 * @date    2020/3/11 18:11
 */
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
        loading: {type: Boolean, default: null},
    },
    data() {
        return {
            p_loading: null,
        }
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
            return !this.isDisabled && !this.isReadonly && !this.isLoading
        },
        isLoading() {
            if (this.p_loading != null) return this.p_loading
            if (this.loading != null) return this.loading
            if (!!this.plParentEditor && this.plParentEditor.isLoading != null) return this.plParentEditor.isLoading
            return null
        },
    },
    created() {
        this.$on('change', (...args) => !!this.plParentEditor && !!this.plParentEditor.isFormItem && this.plParentEditor.onChange && this.plParentEditor.onChange(...args))
        this.$on('blur', (...args) => !!this.plParentEditor && !!this.plParentEditor.isFormItem && this.plParentEditor.onBlur && this.plParentEditor.onBlur(...args))
    },
}

export const StyleMixin = {
    provide() {
        return {
            plParentStyler: this,
        }
    },
    inject: {
        plParentStyler: {default: null},
    },
    props: {
        shape: {type: String},                      // fillet,round,square
        size: {type: String},                       // normal,large,mini
        status: {type: String},                     // primary,success,error,warn,info
    },
    computed: {
        p_shape() {
            if (!!this.shape) return this.shape
            if (!!this.plParentStyler && this.plParentStyler.p_shape) return this.plParentStyler.p_shape
            return null
        },
        p_size() {
            if (!!this.size) return this.size
            if (!!this.plParentStyler && this.plParentStyler.p_size) return this.plParentStyler.p_size
            return null
        },
        p_status() {
            if (!!this.status) return this.status
            if (!!this.plParentStyler && this.plParentStyler.p_status) return this.plParentStyler.p_status
            return null
        },
    },
}


/**
 * 用来生成派发事件方法的迷信
 * @author  韦胜健
 * @date    2020/3/11 18:11
 */
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


/**
 * 用来对属性做转化的mixin函数
 * @author  韦胜健
 * @date    2020/3/11 18:11
 */
export const PropsMixinFactory = {
    Promise: 'Promise',
    Number: 'Number',
    Function: 'Function',
    ALL: ['Promise', 'Number', 'Function'],
    create(config) {
        return {
            watch: Object.keys(config).reduce((ret, propName) => {
                const check = Array.isArray(config[propName]) ? config[propName] : [config[propName]]
                ret[propName] = {
                    immediate: true,
                    async handler(val) {
                        if (val != null) {
                            if (check.indexOf(PropsMixinFactory.Promise) > -1 && !!val.then && typeof val.then === 'function') {
                                val = await val
                            }
                            if (check.indexOf(PropsMixinFactory.Function) > -1 && typeof val === 'function') {
                                val = val(this)
                            }
                            if (check.indexOf(PropsMixinFactory.Number) > -1) {
                                val = String(val)
                                if (/^[\d]+$/.test(val) || val.endsWith('px')) {
                                    val = Number(val.replace('px', ''))
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
    },
}