
import {designPage, reactive, useRefs} from "plain-ui-composition";
// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import PlToggle from "../../../src/packages/PlToggle";
import Plc from "../../../src/packages/Plc";
import {TableNode} from "../../../src/packages/PlTable/table/use/useTableNode";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcToggle} from "../../../src/packages/PlcToggle";
import {PlcRate} from "../../../src/packages/PlcRate";
import {PlcColorPicker} from "../../../src/packages/PlcColorPicker";
import {PlcDate} from "../../../src/packages/PlcDate";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {PlcIndex} from "../../../src/packages/PlcIndex";
import {PlcCheck} from "../../../src/packages/PlcCheck";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import PlSelectOption from "../../../src/packages/PlSelectOption";
import PlIcon from "../../../src/packages/PlIcon";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        check: PlcCheck,
    })

    const state = reactive({
        data,
        editNodes: [] as TableNode[],
        virtualFlag: false,

        onDblClickRow(tableNode: TableNode) {
            if (!tableNode.edit) {
                tableNode.enableEdit()
                state.editNodes.push(tableNode)
            }
        },
        saveEdit: async () => {
            const validates = (await Promise.all(state.editNodes.map(node => node.validate()))).filter(Boolean)
            if (validates.length > 0) {
                console.log(validates)
                const {errors, node: {index}} = validates[0]!
                $$message.error(`???${index + 1}???????????????????????????${errors[0].label}:${errors[0].message}`)
                return
            }
            // todo ??????????????????
            state.editNodes.forEach(tableNode => tableNode.saveEdit(tableNode.editRow))
            state.editNodes.forEach(tableNode => tableNode.closeEdit())
            state.editNodes = []
        },
        cancelEdit: () => {
            state.editNodes.forEach(tableNode => {
                tableNode.cancelEdit()
            })
            state.editNodes = []
        },
        logSelected: async () => {
            const selected = refs.check!.getSelected()
            console.log(selected)
            $$message(selected.map((item: TableNode) => item.data.name).join(','))
        },
        clearSelected: async () => {
            refs.check!.clearAll()
        },
        addSelected: async () => {
            refs.check!.addSelected([1, 2])
        },
        removeSelected: async () => {
            refs.check!.removeSelected([1, 2])
        }
    })

    return () => (
        <div>
            <DemoRow title={'????????????'}>
                <PlForm column={1}>
                    <PlButtonGroup>
                        <PlButton label={'???????????????'} onClick={() => state.logSelected()}/>
                        <PlButton label={'???????????????'} onClick={() => state.clearSelected()}/>
                        <PlButton label={'???????????????????????????'} onClick={() => state.addSelected()}/>
                        <PlButton label={'???????????????????????????'} onClick={() => state.removeSelected()}/>
                    </PlButtonGroup>
                    <PlFormItem label={'????????????????????????'}>
                        <PlToggle v-model={state.virtualFlag}/>
                    </PlFormItem>
                    <PlFormItem label={'??????'}>
                        <PlButtonGroup disabled={state.editNodes.length === 0}>
                            <PlButton onClick={state.saveEdit} label={'????????????'}/>
                            <PlButton onClick={state.cancelEdit} label={'????????????'}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'????????????'}>
                <PlTable
                    virtual={state.virtualFlag}
                    data={data}
                    onDblclickCell={state.onDblClickRow}
                    keyField={'id'}
                >
                    <PlcIndex/>
                    <PlcCheck ref={onRef.check}/>
                    <Plc field="id" title="??????"/>
                    <Plc field="name" title="???????????????"/>
                    <PlcInput field="name" title="?????????" required/>
                    <PlcNumber field={'size'} title={'?????????'}/>
                    <PlcDate field={'date'} title={'??????'}/>
                    <PlcColorPicker field={'color'} title={'??????'}/>
                    <PlcRate field={'star'} title={'??????'}/>
                    <PlcToggle field={'flag'} title={'??????'}/>
                    <PlcCheckbox field={'flag'} title={'??????'}/>
                    <PlcSelect field="flag" title="????????????">
                        <PlSelectOption label="???" val="Y">
                            <PlIcon icon="el-icon-success" status="success"/>
                            <span>???</span>
                        </PlSelectOption>
                        <PlSelectOption label="???" val="N">
                            <PlIcon icon="el-icon-error" status="error"/>
                            <span>???</span>
                        </PlSelectOption>
                    </PlcSelect>
                </PlTable>
            </DemoRow>
        </div>
    )
})
