const EmitMixin = {
    data() {
        const emitters = this.$options.emitters
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

export {EmitMixin}