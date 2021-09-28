import {designPage, SimpleFunction} from "plain-design-composition";
// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import {reactive} from "plain-design-composition";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import PlToggle from "../../../src/packages/PlToggle";
import Plc from "../../../src/packages/Plc";
import {TableNode} from "../../../src/packages/PlTable/table/use/useTableNode";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import {PlRadio} from "../../../src/packages/PlRadio";
import {RuleItem} from "async-validator";
import {PlcRate} from "../../../src/packages/PlcRate";
import {PlcColorPicker} from "../../../src/packages/PlcColorPicker";
import {PlcDate} from "../../../src/packages/PlcDate";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {PlcIndex} from "../../../src/packages/PlcIndex";

export default designPage(() => {

    const state = reactive({
        size: undefined as any,
        data,
        editNodes: [] as TableNode[],
        virtualFlag: false,
        associateFields: {
            name: 'size',
        },
        isEditable: ({editRow}: TableNode) => !!editRow.name && editRow.name.length > 5,
        customRule: {
            asyncValidator: (rule: RuleItem, value: any, cb: SimpleFunction, row: any) => {
                cb(
                    !!row.name && row.name.length > 5 ?
                        (!row.size && row.size !== 0) ? 'name 长度大于5情况下必填' : undefined
                        : undefined
                )
            }
        },
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
                    <PlFormItem label="大小尺寸">
                        <PlRadioGroup v-model={state.size}>
                            <PlRadio label="large" val="large"/>
                            <PlRadio label="normal" val="normal"/>
                            <PlRadio label="mini" val="mini"/>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label={'是否开启虚拟滚动'}>
                        <PlToggle v-model={state.virtualFlag}/>
                    </PlFormItem>
                    <PlFormItem label={'编辑'}>
                        <PlButtonGroup disabled={state.editNodes.length === 0}>
                            <PlButton onClick={state.saveEdit} label={'保存编辑'}/>
                            <PlButton onClick={state.cancelEdit} label={'取消编辑'}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'行内编辑'}>
                <PlTable
                    virtual={state.virtualFlag}
                    data={data}
                    associateFields={state.associateFields}
                    onDblclickCell={state.onDblClickRow}
                    size={state.size}
                >
                    <PlcIndex/>
                    <Plc field="id" title="编号" width={'50'}/>
                    <Plc field="name" title="普通文本列"/>
                    <Plc field="name" title="普通文本列，编辑作用域插槽" width={200} editable={state.isEditable}
                         v-slots={{
                             edit: ({row}) => (
                                 <input type="text" v-model={row.name} style={{paddingLeft: '8px'}}/>
                             )
                         }}
                    />
                    <PlcInput field="name" title="禁用编辑" editable={false}/>
                    <PlcInput field="name" title="文本框" required/>
                    <PlcInput field="size" title="文本框值大于6可以编辑" width={200} editable={state.isEditable} rules={state.customRule}/>
                    <PlcNumber field={'size'} title={'数字框'}/>
                    <PlcDate field={'date'} title={'日期'}/>
                    <PlcColorPicker field={'color'} title={'颜色'}/>
                    <PlcRate field={'star'} title={'评分'}/>
                </PlTable>
            </DemoRow>
        </div>
    )
})
