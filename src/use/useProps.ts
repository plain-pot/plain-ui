import {reactive, watch} from 'vue'
import {toArray} from "../utils/toArray";

export enum FormatPropType {
    PROMISE = 'PROMISE',
    FUNCTION = 'FUNCTION',
    NUMBER = 'NUMBER',
}

async function usePropsFormatter(state: any, key: string, val: any, types: FormatPropType | FormatPropType[]): Promise<void> {

    if (val == null) {
        state[key] = val
        return
    }

    const formatTypes = toArray(types)

    if (formatTypes.indexOf(FormatPropType.PROMISE) > -1 && !!val.then && typeof val.then === 'function') {
        val = await val
    }

    if (formatTypes.indexOf(FormatPropType.FUNCTION) > -1 && typeof val === "function") {
        val = val()
    }

    if (formatTypes.indexOf(FormatPropType.NUMBER) > -1 && typeof val === "string") {
        if (/^[\d]+$/.test(val)) {
            val = Number(val)
        } else {
            if (val.lastIndexOf('px') === val.length - 2) {
                val = Number(val.replace('px', ''))
            }
        }
    }

    state[key] = val
}

function usePropsInner<Props extends { [k: string]: any },
    Config extends Partial<{ [k in keyof Props]: FormatPropType | FormatPropType[] }>>
(
    props: Props,
    config: Config
) {

    const configKeys = Object.keys(config)
    const state = reactive((() => configKeys.reduce((prev: any, configKey) => {
        prev[configKey] = null
        // @ts-ignore
        usePropsFormatter(prev, configKey, props[configKey], config[configKey])
        return prev
    }, {}) as { [k in Exclude<keyof Props, Exclude<keyof Props, keyof Config>>]: Props[k] })() )

    configKeys.forEach(configKey => {
        watch(() => props[configKey], val => {
            // @ts-ignore
            usePropsFormatter(state, configKey, val, config[configKey])
        })
    })

    return {
        propsState: state,
    }
}

export const useProps = Object.assign(usePropsInner, FormatPropType)

interface MyProps {
    name: string | undefined
    age: number
    flag: boolean
}

const {propsState} = useProps({} as MyProps, {
    name: useProps.PROMISE,
    age: useProps.NUMBER
})
