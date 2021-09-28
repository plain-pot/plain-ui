import {designPage, reactive, useRefs} from "plain-design-composition";
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
import {PlcCheck} from "../../../src/packages/PlcCheck";
import {PlcToggle} from "../../../src/packages/PlcToggle";
import {PlcRate} from "../../../src/packages/PlcRate";
import {PlcColorPicker} from "../../../src/packages/PlcColorPicker";
import {PlcDate} from "../../../src/packages/PlcDate";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {PlcDraggier} from "../../../src/packages/PlcDraggier";
import {PlcIndex} from "../../../src/packages/PlcIndex";

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
                $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                return
            }
            // todo 网络保存逻辑
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
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlForm column={1}>
                    <PlFormItem label={'是否开启虚拟滚动'}>
                        <PlToggle v-model={state.virtualFlag}/>
                    </PlFormItem>
                    <PlFormItem label={'编辑'}>
                        <PlButtonGroup disabled={state.editNodes.length === 0}>
                            <PlButton label={'打印数据'} disabled={false} onClick={() => console.log(data.map((item: any) => item.name).join(','))}/>
                            <PlButton label={'获取选中行'} disabled={false} onClick={() => {
                                $$message(refs.check!.getSelected().map((item: any) => item.data.name).join(','))
                            }}/>
                            <PlButton onClick={state.saveEdit} label={'保存编辑'}/>
                            <PlButton onClick={state.cancelEdit} label={'取消编辑'}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <PlTable
                virtual={state.virtualFlag}
                data={data}
                onDblclickCell={state.onDblClickRow}>
                <PlcIndex/>
                <PlcCheck ref={onRef.check} toggleOnClickRow/>
                <PlcDraggier key={state.virtualFlag ? 1 : 2}/>
                <Plc field="id" title="编号"/>
                <Plc field="name" title="普通文本列"/>
                <PlcInput field="name" title="文本框" required/>
                <PlcNumber field={'size'} title={'数字框'}/>
                <PlcDate field={'date'} title={'日期'}/>
                <PlcColorPicker field={'color'} title={'颜色'}/>
                <PlcRate field={'star'} title={'评分'}/>
                <PlcToggle field={'flag'} title={'开关'}/>
            </PlTable>
        </div>
    )
})
