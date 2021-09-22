import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {usePermission} from "./userPermission";

export function useTableOptionPermit({config, hooks}: { config: tTableOptionConfig, hooks: tTableOptionHooks }) {
    const {init, permit} = usePermission({
        ...config,
        onGetEnable: hooks.onGetEnable.exec,
    })
    hooks.onInit.use(async () => {await init})
    return permit
}

export type tTableOptionPermit = ReturnType<typeof useTableOptionPermit>
