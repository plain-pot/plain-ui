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
        const ref = option[key]
        if (ref.cache == undefined) ref.cache = false
        if (ref.get == undefined) ref.get = function () {
            return this.$refs[key]
        }
        ret[key] = {...ref}
        return ret
    }, {})
    return {
        computed: {
            ...refs
        }
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
}