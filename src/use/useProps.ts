import {reactive, watch} from 'vue'
import {toArray} from "../utils/toArray";

export enum FormatPropType {
    PROMISE = 'PROMISE',
    FUNCTION = 'FUNCTION',
    NUMBER = 'NUMBER',
}

/**
 * ignorePromise:第一次获取值的时候，忽略Promise格式化，而是通过 watch immediate 来实现赋值
 * @author  韦胜健
 * @date    2020/10/30 15:29
 */
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

    const formatConfig: { [k in keyof Props]: FormatPropType[] } = configKeys.reduce((prev, key) => {
        prev[key] = toArray(config[key])
        return prev
    }, {} as any)

    const state = reactive((() =>
        configKeys.reduce((prev: any, configKey) => {
            prev[configKey] = null
            const formatTypes = formatConfig[configKey]
            /**
             * 如果是Promise，则跳过处理，在watch immediate中初始化
             * @author  韦胜健
             * @date    2020/11/3 20:10
             */
            if (formatTypes.indexOf(FormatPropType.PROMISE) === -1) {
                usePropsFormatter(prev, configKey, props[configKey], formatTypes)
            }
            return prev
        }, {}) as { [k in Exclude<keyof Props, Exclude<keyof Props, keyof Config>>]: Props[k] })
    ())

    configKeys.forEach(configKey => {
        watch(() => props[configKey], val => {
            // @ts-ignore
            usePropsFormatter(state, configKey, val, config[configKey])
        }, {immediate: formatConfig[configKey].indexOf(FormatPropType.PROMISE) > -1})
    })

    return {
        propsState: state,
    }
}

export const useProps = Object.assign(usePropsInner, FormatPropType)