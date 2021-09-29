import {computed, reactive, ref} from "plain-design-composition";

export function useAsyncMethods<Methods extends { [k: string]: (...args: any) => any }>(methods: Methods, delayTimer = 200):
    Methods & { isLoading: { [k in keyof Methods]: boolean } & { all: boolean } } {

    const loadingKeys = ref([] as string[])
    const isLoading = reactive({
        ...Object.keys(methods).reduce((prev, key) => {
            prev[key] = computed(() => loadingKeys.value.indexOf(key) > -1)
            return prev
        }, {} as any),
        all: computed(() => loadingKeys.value.length > 0)
    })

    return {
        ...Object.entries(methods).reduce((prev, [methodsKey, methodFunc]) => {
            (prev as any)[methodsKey] = async (...args: any[]) => {
                // 方法目前正在加载状态，再次调用不做任何操作
                if (isLoading[methodsKey]) {return}
                let timer: any = setTimeout(() => {
                    loadingKeys.value.push(methodsKey)
                    timer = null
                }, delayTimer)
                try {
                    return await methodFunc(...args)
                } catch (e) {
                    console.warn('cancel loading!')
                    throw e
                } finally {
                    if (timer != null) {
                        /*当前加载时间没有超过 delayTimer，直接清空定时器*/
                        clearTimeout(timer)
                    } else {
                        /*当前加载事件已经超过 delayTimer，表明定时器已经执行，此时关闭加载状态*/
                        loadingKeys.value.splice(loadingKeys.value.indexOf(methodsKey), 1)
                    }
                }
            }
            return prev
        }, {} as Methods),
        isLoading,
    }
}