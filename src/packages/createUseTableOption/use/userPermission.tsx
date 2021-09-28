import {TableProConfigEnable} from "../createUseTableOption.utils";
import {computed, reactive} from "plain-design-composition";

export interface PermissionState {
    insert: null | boolean,
    update: null | boolean,
    delete: null | boolean,
    isInit: boolean,
}

export interface PermissionEnable {
    insert: boolean,
    update: boolean,
    delete: boolean
}

export interface PermissionGetEnable {
    (param: PermissionEnable): PermissionEnable
}

export function usePermission(config: { permission?: string, enable?: TableProConfigEnable, onGetEnable: PermissionGetEnable }) {
    const state: PermissionState = reactive({insert: null, update: null, delete: null, isInit: false})

    /*权限数据加载初始化*/
    const init = new Promise<PermissionState>((resolve) => {

        const defaultPermission = {insert: true, update: true, delete: true}

        /*如果没有配置表格的权限前缀名，默认启用可新建编辑删除*/
        if (!config.permission) {
            Object.assign(state, defaultPermission)
            return resolve(state)
        }

        /*否则等待权限加载完毕*/
        setTimeout(() => Object.assign(state, defaultPermission), 0)

    })

    init.then(() => state.isInit = true)

    const enable = computed(() => {
        const defaultEnable = {
            insert: !!state.insert,
            update: !!state.update,
            delete: !!state.delete,
        }
        return config.onGetEnable(typeof config.enable === 'undefined' ? {...defaultEnable} :
            typeof config.enable === "boolean" ? {
                insert: config.enable,
                update: config.enable,
                delete: config.enable,
            } : {
                insert: typeof config.enable.insert === "function" ? config.enable.insert() : config.enable.insert != null ? config.enable.insert : defaultEnable.insert,
                update: typeof config.enable.update === "function" ? config.enable.update() : config.enable.update != null ? config.enable.update : defaultEnable.update,
                delete: typeof config.enable.delete === "function" ? config.enable.delete() : config.enable.delete != null ? config.enable.delete : defaultEnable.delete,
            })
    })

    /**
     * 直接reactive(enable)不行，不知道为啥虽然类型提示是对的，但是实际运行的时候还是原来的计算属性值
     * @author  韦胜健
     * @date    2021/6/29 11:16
     */
    const permit: { [k in keyof PermissionState]: boolean } = reactive({
        insert: computed(() => enable.value.insert),
        update: computed(() => enable.value.update),
        delete: computed(() => enable.value.delete),
        isInit: computed(() => state.isInit)
    })

    return {init, permit}
}
