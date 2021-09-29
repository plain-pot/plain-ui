import {designPage} from "plain-design-composition";

import {useTableOption} from "../../../src";
import PlTablePro from "../../../src/packages/PlTablePro";
import {PlcDate, PlSelectOption, Plc, PlIcon} from "../../../src";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {TableRenderScope} from "../../../src/packages/PlTable/plc/utils/plc.type";
import PlcTextarea from "../../../src/packages/PlcTextarea";
import {PlcGroup} from "../../../src/packages/PlcGroup";

export default designPage(() => {

    const option = useTableOption({
        title: '示例列表',
        url: '/demo',
        // editType: 'form',
        defaultNewRow: {
            count: 100
        },
        // enable: false,
        /*enable: {
            update: false
        },*/
        buttons: [
            {
                label: '详情',
                code: 'detail',
                type: 'other',
                position: 'in',
                handler: (node) => {
                    console.log(node)
                }
            },
            {
                label: '发布',
                code: 'publish',
                type: 'other',
                position: 'out',
                handler: (node) => {
                    console.log(node)
                }
            },
            {
                label: '发布',
                code: 'publish',
                type: 'other',
                position: 'in',
                handler: (node) => {
                    console.log(node)
                }
            },
        ],
        hooks: {
            /*onRequestData: (data) => {
                data.distinctFields = ['normalText']
            }*/
        },
        // filterParam: {queries: [{field: 'normalText', operator: '~', value: '22'}]},
    })

    const onClick = (data: { e: MouseEvent, scope: TableRenderScope }) => {
        console.log({...data.scope.row})
    }

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <PlcGroup title="分组一">
                    <Plc title="编号id" field="id" link onClick={onClick} hideInForm/>
                    <PlcDate title="创建时间" field="createdAt" hideInForm width={200} editable={false} datetime/>
                    <PlcDate title="更新时间" field="updatedAt" hideInForm width={200} editable={false} datetime/>
                    <PlcDate title="日期" field="dateVal"/>
                </PlcGroup>
                <PlcGroup title="分组二">
                    <PlcGroup title="分组二-1">
                        <PlcNumber title="计数count" field="count" required/>
                        <PlcInput title="文本normalText" field="normalText" required fixed="left"/>
                        <PlcNumber title="数字numberVal" field="numberVal"/>
                    </PlcGroup>
                    <PlcGroup title="分组二-2">
                        <PlcCheckbox title="复选框flag" field="flag"/>
                        <PlcSelect title="下拉框selectVal" field="selectVal">
                            <PlSelectOption label="消费者" val="consumer">
                                <PlIcon icon="el-icon-s-custom" status="primary" style={{marginRight: '4px'}}/>
                                <span>消费者</span>
                            </PlSelectOption>
                            <PlSelectOption label="潜在客户" val="potential">
                                <PlIcon icon="el-icon-place" status="info" style={{marginRight: '4px'}}/>
                                <span>潜在客户</span>
                            </PlSelectOption>
                            <PlSelectOption label="门店" val="store">
                                <PlIcon icon="el-icon-s-shop" status="error" style={{marginRight: '4px'}}/>
                                <span>门店</span>
                            </PlSelectOption>
                        </PlcSelect>
                        <PlcTextarea title="长文本longText" field="longText"/>
                    </PlcGroup>
                </PlcGroup>
            </PlTablePro>
        </div>
    </>
})
