import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import {PlcIndex} from "../../../PlcIndex";
import {PlcDraggier} from "../../../PlcDraggier";
import {reactive} from "plain-ui-composition";
import {PlcSelect} from "../../../PlcSelect";
import PlSelectOption from "../../../PlSelectOption";
import {PlcNumber} from "../../../PlcNumber";
import PlButton from "../../../PlButton";
import './use.setting.config.scss'
import {PlcInput} from "../../../PlcInput";
import PlCheckbox from "../../../PlCheckbox";
import {tTableOptionCache} from "../use.cache";
import {getPlcKey} from "../../../PlTable/plc/utils/usePropsState";
import {iTableOptionApplyCacheParam} from "../use.cache.utils";
import {tTableOptionHooks} from "../use.hooks";

interface iPlcConfigData {
    title?: string,
    order: number,
    align: string,
    width: number,
    fixed: string,
    hide?: boolean,

    plcRef: () => tPlc,
    key: string,
}

interface iPlcConfigCacheData {
    [k: string]: Partial<Omit<iPlcConfigData, 'plcRef'>>
}

export function useTableOptionSettingConfig(
    {
        useTableOptionSettingInner,
        getSourceFlatPlcList,
        cache,
        hooks,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        getSourceFlatPlcList: () => tPlc[],
        cache: tTableOptionCache,
        hooks: tTableOptionHooks,
    }) {

    const CACHE_KEY = 'table-config'

    const state = reactive({
        data: [] as iPlcConfigData[]
    })

    const utils = {
        resetData: () => {
            state.data = getSourceFlatPlcList().map((plc, index): iPlcConfigData => ({
                title: plc.props.title,
                order: index,
                align: plc.props.align || 'left',
                width: plc.props.width,
                fixed: plc.props.fixed,
                hide: plc.props.hide,

                plcRef: () => plc,
                key: getPlcKey(plc),
            }))
            /*console.log(getSourceFlatPlcList().map(i => {
                const {title, order, fixed, align, width, hide} = i.getState()
                return {title, order, fixed, align, width, hide}
            }))*/
        },
        applyConfigCache: (flatList: tPlc[], cacheData: iPlcConfigCacheData | undefined) => {
            flatList.forEach(plc => {
                const key = getPlcKey(plc)
                const cacheItem = !cacheData ? undefined : cacheData[key]
                const plcState = plc.getState()
                Object.keys(plcState).forEach(key => {
                    if (!!cacheItem) {
                        if ((cacheItem as any)[key] !== undefined) {
                            (plcState as any)[key] = (cacheItem as any)[key]
                        }
                    } else {
                        (plcState as any)[key] = undefined
                    }
                })
            })
        },
    }

    hooks.onTableConfig.use(({cacheData, flatList}) => {
        const cacheDataItem = !cacheData.activeId ? null : cacheData.data.find(i => i.id === cacheData.activeId)
        if (!cacheDataItem) {return}
        const cacheItem = cacheDataItem.data[CACHE_KEY]
        if (!cacheItem) {return;}
        utils.applyConfigCache(flatList, cacheItem)
    })

    cache.registry<iPlcConfigCacheData>({
        cacheKey: CACHE_KEY,
        applyCache: (() => {
            let count = 1
            return ({cacheData}: iTableOptionApplyCacheParam<iPlcConfigCacheData>) => {
                if (count > 0) {
                    //  ???????????????????????????table.props.config????????????????????????
                    count--
                    return
                }
                utils.applyConfigCache(getSourceFlatPlcList(), cacheData)
            }
        })(),
        getCache: () => {
            return getSourceFlatPlcList().reduce((prev, item) => {
                const key = getPlcKey(item)
                prev[key] = {...item.getState(), key,}
                return prev
            }, {} as iPlcConfigCacheData)
        },
    })

    const handler = {
        apply: () => {
            const hasOrderChange = state.data.some((i, idx) => i.order !== idx)
            state.data.forEach((item, index) => {
                const plcState = item.plcRef().getState()
                const plcProps = item.plcRef().props
                if (hasOrderChange) {plcState.order = index}
                Object.entries(item).forEach(([key, value]) => {
                    switch (key) {
                        case 'order':
                            return;
                        case 'align':
                            if (plcProps.align === undefined) {
                                if (value !== 'left') {
                                    plcState.align = value as any
                                }
                            } else {
                                if (plcProps.align != value) {
                                    plcState.align = value as any
                                }
                            }
                            return;
                        default:
                            if ((plcProps as any)[key] !== value) {
                                (plcState as any)[key] = value
                            }
                    }
                })
            })
            setTimeout(() => utils.resetData())
        },
        reset: () => {
            getSourceFlatPlcList().forEach(plc => {
                const state = plc.getState()
                Object.keys(state).forEach(key => {
                    (state as any)[key] = undefined
                })
            })
            setTimeout(() => {utils.resetData()})
        },
        onFixed: (row: iPlcConfigData) => {
            const data = [...state.data]
            const index = data.indexOf(row)
            data.splice(index, 1)
            const firstNotFixedIndex = data.findIndex((i) => i.fixed != 'left')
            data.splice(firstNotFixedIndex, 0, row)
            state.data = [...data]
        }
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.config,
        title: '????????????',
        seq: 3,
        beforeOpen: () => {
            utils.resetData()
        },
        render: () => (
            <div class="pl-table-pro-setting-config">
                <div class="pl-table-pro-setting-config-button">
                    <PlButton label="??????" onClick={handler.apply}/>
                    <PlButton label="??????" mode="stroke" status="error" onClick={handler.reset}/>
                </div>
                <PlTable v-models={[[state.data, 'data']]} showRows={Math.max(5, state.data.length)} defaultEditingWhenAddRow editSourceRow>
                    <PlcIndex/>
                    <PlcDraggier/>
                    <PlcInput title="??????" field="title"/>
                    <PlcSelect title="????????????" field="align" width={100}>
                        <PlSelectOption label="?????????" val="left"/>
                        <PlSelectOption label="????????????" val="center"/>
                        <PlSelectOption label="?????????" val="right"/>
                    </PlcSelect>
                    <PlcNumber title="??????" field="width" width={130}/>
                    <Plc title="??????" width={60} align="center" field="fixed" addEditPadding v-slots={{
                        normal: ({row}) => <PlCheckbox modelValue={row.fixed === 'left'} customReadonly onClick={() => (row.fixed = (row.fixed === 'left' ? undefined : 'left'), handler.onFixed(row as any))}/>
                    }}/>
                    <Plc title="??????" width={60} align="center" field="hide" addEditPadding v-slots={{
                        normal: ({row}) => <PlCheckbox modelValue={row.hide === true} customReadonly onClick={() => (row.hide = (row.hide === true ? undefined : true))}/>
                    }}/>
                    <Plc title={' '} fit width={10}/>
                </PlTable>
            </div>
        )
    })
}
