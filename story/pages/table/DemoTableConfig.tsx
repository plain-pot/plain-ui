import {designPage, reactive} from "plain-ui-composition";

// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import PlTable from "../../../src/packages/PlTable";
import {Plc} from "../../../src/packages/Plc";
import PlcGroup from "../../../src/packages/PlTable/plc/core/PlcGroup";
import {tPlcType} from "../../../src/packages/PlTable/plc/utils/plc.type";
import {tPlcCacheStateData} from "../../../src/packages/PlTable/plc/utils/usePropsState";
import {getTableId} from "../../../src/packages/createUseTableOption/use/use.cache.utils";

export default designPage(() => {

    const TableConfigController = (() => {

        const cache = (() => {
            const CACHE_KEY = '@@TABLE_CONFIG_CACHE'
            let cacheString = window.localStorage.getItem(CACHE_KEY)
            let cacheData: Record<string, undefined | tPlcCacheStateData> = {}
            if (!!cacheString) {
                cacheData = JSON.parse(cacheString)
            }
            return {
                get: (tableId: string) => {
                    return cacheData[tableId]
                },
                set: (tableId: string, stateData: tPlcCacheStateData) => {
                    cacheData[tableId] = stateData
                    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
                },
            }
        })();

        const propsConfig = (plcList: tPlcType[]) => {
            const tableId = getTableId(plcList)
            const cacheState = cache.get(tableId)
            if (!!cacheState) {
                Plc.applyPropsState(cacheState, plcList)
            }
        }

        const propsOnConfigPlc = ({plcList, stateData}: { plcList: tPlcType[], stateData: tPlcCacheStateData }) => {
            const tableId = getTableId(plcList)
            cache.set(tableId, stateData)
        }

        return {
            propsConfig,
            propsOnConfigPlc,
        }
    })();

    const state = reactive({
        data,
        plc: {
            width: 200,
            align: 'left',
            init: true,
            order: 5,
        },
        hide: {
            name: false,
            star: false,
        },
        fixed: {
            colorFixedLeft: false,
            nameFixedLeft: false,
        },
    })


    return () => (
        <div>
            <DemoRow title={'????????????'}>
                <PlForm>
                    <PlFormItem label={'??????????????????'}>
                        <PlNumber v-model={state.plc.width} step={30}/>
                    </PlFormItem>
                    <PlFormItem label={'?????????'}>
                        <PlCheckbox label={'????????????'} v-model={state.hide.name} width={'50%'}/>
                        <PlCheckbox label={'????????????'} v-model={state.hide.star} width={'50%'}/>
                    </PlFormItem>
                    <PlFormItem title={'??????'}>
                        <PlCheckbox label={'???????????????'} v-model={state.fixed.colorFixedLeft} width={'50%'}/>
                        <PlCheckbox label={'???????????????'} v-model={state.fixed.nameFixedLeft} width={'50%'}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'?????????'}>
                <PlTable
                    config={TableConfigController.propsConfig}
                    onConfigPlc={TableConfigController.propsOnConfigPlc}
                    data={data}
                    colDraggable
                    border
                >
                    <Plc field={'id'} title={'??????'} width={"200px"} fixed={"left"}/>
                    {/*??????????????????props?????????????????????????????? ???config ??????????????????????????????????????????????????????????????????*/}
                    <Plc field={'size'} title={'??????'} width={state.plc.width}/>
                    <Plc field={'date'} title={'??????'}/>
                    <Plc field={'color'} title={'??????'} fixed={state.fixed.colorFixedLeft ? 'left' : 'center'}/>
                    <Plc field={'name'} title={'??????'} hide={state.hide.name} fixed={state.fixed.nameFixedLeft ? 'left' : 'center'}/>
                    <Plc field={'star'} title={'??????'} hide={state.hide.star}/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'??????'}>
                <PlTable
                    config={TableConfigController.propsConfig}
                    onConfigPlc={TableConfigController.propsOnConfigPlc}
                    data={data}
                    colDraggable
                    border
                >
                    <Plc field={'id'} title={'??????'} width={"200px"} fixed="left"/>
                    <PlcGroup title={'?????????'}>
                        <Plc field={'size'} title={'??????'} width={state.plc.width}/>
                        <Plc field={'date'} title={'??????'}/>
                    </PlcGroup>
                    <Plc field={'color'} title={'??????'} fixed={state.fixed.colorFixedLeft ? 'left' : 'center'}/>
                    <PlcGroup title={'?????????'}>
                        <Plc field={'name'} title={'??????'} hide={state.hide.name} fixed={state.fixed.nameFixedLeft ? 'left' : 'center'}/>
                        <Plc field={'star'} title={'??????'} hide={state.hide.star}/>
                    </PlcGroup>
                </PlTable>
            </DemoRow>
        </div>
    )
})
