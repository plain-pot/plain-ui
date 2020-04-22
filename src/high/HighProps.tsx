/*
function processFunction(value) {
    if (typeof value === 'function') {
        return value()
    }
    return value
}

function processNumber(value) {
    const type = typeof value
    if (type === 'number') {
        return value
    }
    if (type === 'string') {
        if (/^[\d]+$/.test(value)) {
            return Number(value)
        } else if (/^\d+px$/.test(value)) {
            return Number(value.replace('px', ''))
        }
    }
    return value
}

interface HighPropsType {
    (Component: Object, option: { [key: string]: string }): Object
}

export class PlainHigh {
    static high: HighPropsType = (option, Component) => {
        const propNames = Object.keys(option)
        const promisePropNames = propNames.filter(propName => option[propName] === PlainHigh.Promise || option[propName] === PlainHigh.All)

        const watch = {}
        const props = {}

        promisePropNames.forEach((propName) => {
            props[propName] = {}
            watch[propName] = {
                immediate: true,
                handler: async function (val) {
                    this.tempProps[propName] = await val
                }
            }
        })

        const data = function () {
            return {
                tempProps: promisePropNames.reduce((ret, propName) => {
                    ret[propName] = null
                    return ret
                }, {})
            }
        }

        const computed = {
            propsBinding() {
                const props = Object.keys(option).reduce((ret, propName) => {

                    let val = (option[propName] === PlainHigh.Promise || option[propName] === PlainHigh.All) ? this.tempProps[propName] : this.$attrs[propName]

                    if (option[propName] === PlainHigh.Function || option[propName] === PlainHigh.All) {
                        val = processFunction(val)
                    }
                    if (option[propName] === PlainHigh.Number || option[propName] === PlainHigh.All) {
                        val = processNumber(val)
                    }

                    ret[propName] = val

                    return ret
                }, {})
                return {
                    ...this.$attrs,
                    ...props,
                }

            },
        }

        return {
            name: Component.name,
            props,
            watch,
            data,
            computed,
            render(h) {
                const propsBinding = this.propsBinding
                // @ts-ignore
                return <Component {...{props: propsBinding, on: this.$listeners}}/>
            },
            methods: Object.keys(Component.methods).reduce((ret, methodsName) => {
                ret[methodsName] = function (...args) {
                    return this.$refs.target[methodsName](...args)
                }
              return ret
            }, {}),
        }

    }

    static Number = 'Number'
    static Promise = 'Promise'
    static Function = 'Function'
    static All = 'All'
}*/
