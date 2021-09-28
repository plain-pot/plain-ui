import {reactive} from "plain-design-composition";

import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {tTableOptionHooks} from "../use.hooks";
import {iTableOptionSortData, tTableOptionSort} from "../use.sort.state";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import PlDropdown from "../../../PlDropdown";
import PlButton from "../../../PlButton";
import PlIcon from "../../../PlIcon";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import PlTable from "../../../PlTable";
import {PlcIndex} from "../../../PlcIndex";
import {PlcDraggier} from "../../../PlcDraggier";
import {Plc} from "../../../Plc";
import PlToggle from "../../../PlToggle";
import {deepcopy} from "plain-utils/object/deepcopy";

export function useTableOptionSettingSort(
    {
        hooks, sortState, getSourceFlatPlcList, useTableOptionSettingInner,
    }: {
        hooks: tTableOptionHooks,
        sortState: tTableOptionSort,
        getSourceFlatPlcList: () => tPlc[],
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
    }) {

    const state = reactive({
        sortData: [] as iTableOptionSortData[],
    })

    const handler = {
        add: ({title, field}: Omit<iTableOptionSortData, 'seq'>) => {
            state.sortData = [...state.sortData, {title, field, desc: true, seq: sortState.seqData.value.min}]
        },
        remove: (data: Omit<iTableOptionSortData, 'seq'>) => {
            state.sortData = state.sortData.filter(({title, field}) => title !== data.title && field !== data.field)
        },
        clear: () => {
            state.sortData = []
            handler.apply()
        },
        apply: () => {
            sortState.setSort(state.sortData || [])
        },
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.sort,
        title: '高级排序',
        seq: 2,
        beforeOpen: async () => {
            state.sortData = deepcopy(sortState.sortStateData.value)
        },
        render: () => (
            <div>
                <div class="pl-table-pro-setting-content-header">
                    <PlButton label="清空" onClick={handler.clear} mode="stroke" status="error"/>
                    <PlDropdown v-slots={{
                        reference: ({open}) => (
                            <PlButton style={{marginBottom: '16px'}}>
                                <span>新增排序字段</span>
                                <PlIcon icon={'el-icon-arrow-down'} style={{transition: 'transform 200ms linear', transform: `rotateX(${open ? 180 : 0}deg)`,}}/>
                            </PlButton>
                        ),
                        popper: () => <PlDropdownMenu>
                            {getSourceFlatPlcList().filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    handler.add({field: plc.props.field!, title: plc.props.title!, desc: true})
                                }}/>
                            ))}
                        </PlDropdownMenu>
                    }}/>
                    <PlButton label="应用" onClick={handler.apply}/>
                </div>
                <PlTable v-model-data={state.sortData} showRows={Math.max(state.sortData.length, 5)}>
                    <PlcIndex/>
                    <PlcDraggier/>
                    <Plc title="排序字段" field="title"/>
                    <Plc title="排序方式" field="desc" v-slots={{
                        normal: ({row}) => (
                            <div>
                                <PlToggle v-model={row.desc} size="mini"/>
                                <span style={{marginLeft: '4px'}}>{row.desc ? '降序' : '升序'}</span>
                            </div>
                        )
                    }}/>
                    <Plc align="center" v-slots={{
                        normal: ({node}) => (
                            <PlButton label="删除" mode="text" status="error" onClick={() => handler.remove(node.data as any)}/>
                        )
                    }}/>
                </PlTable>
            </div>
        )
    })
}
