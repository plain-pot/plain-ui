import {tUseTableOption} from "../createUseTableOption";
import {iUseHttp} from "../useHttp/useHttp.utils";
import {iUseAddressConfig} from "../useAddress/useAddress.utils";
import {iUseOvConfig} from "../useOv/useOv.utils";

export interface InitializeConfigState {
    useTableOption: tUseTableOption,
    useObjectOption: tUseTableOption,
    useHttp: iUseHttp,
    useAddressConfig: iUseAddressConfig,
    useOvConfig: iUseOvConfig,
    getExceljs: () => Promise<any>,
    getFileSaver: () => Promise<any>,
}

let state: InitializeConfigState | null = null

export function initialize(getter: () => InitializeConfigState) {state = getter()}

export function getInitialConfigState<K extends keyof InitializeConfigState>(k: K) {
    if (!state) {throw new Error('请先调用 initialize 初始化 InitializeConfigState')}
    return state[k]
}

export default initialize
