import {ref, SetupContext} from "@vue/composition-api";

/**
 * 组件引用组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useRef<T = HTMLElement>(name?: string, context?: SetupContext): Readonly<{ value: T }> {

    if (!!name) {
        return {
            // @ts-ignore
            get value() {
                return context!.refs[name!]
            },
        }
    } else {
        // @ts-ignore
        return ref(null)
    }
}