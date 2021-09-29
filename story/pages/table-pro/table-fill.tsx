import {designPage} from "plain-ui-composition";

import {Plc, PlcDate, PlIcon, PlSelectOption, useTableOption} from "../../../src";
import PlTablePro from "../../../src/packages/PlTablePro";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import PlcTextarea from "../../../src/packages/PlcTextarea";

export default designPage(() => {

    const option = useTableOption({
        url: '/demo',
        fill: true,
    })

    return () => <>
        <div style={{height: 'calc(100vh - 100px)', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <Plc title="编号id" field="id" hideInForm/>
                <PlcDate title="创建时间" field="createdAt" hideInForm width={200} editable={false}/>
                <PlcDate title="更新时间" field="updatedAt" hideInForm width={200} editable={false}/>
                <PlcDate title="日期" field="dateVal"/>
                <PlcNumber title="计数count" field="count" required/>
                <PlcInput title="文本normalText" field="normalText" required fixed="left"/>
                <PlcNumber title="数字numberVal" field="numberVal"/>
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
            </PlTablePro>
        </div>
    </>
})
