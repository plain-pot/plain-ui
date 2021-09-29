import {designPage} from "plain-ui-composition";
// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import Plc from "../../../src/packages/Plc";
import {PlInput} from "../../../src/packages/PlInput";
import {PlNumber} from "../../../src/packages/PlNumber";
import PlDate from "../../../src/packages/PlDate";
import PlColorPicker from "../../../src/packages/PlColorPicker";
import {deepcopy} from "plain-utils/object/deepcopy";
import {PlcExpand} from "../../../src/packages/PlcExpand";
import {PlcIndex} from "../../../src/packages/PlcIndex";
import {PlcGroup} from "../../../src/packages/PlcGroup";

export default designPage(() => {

    const summaryData = deepcopy(data.slice(0, 2))

    return () => (
        <div>
            <DemoRow title={'展开行'}>
                <PlTable
                    data={data}
                    summaryData={summaryData}
                    virtual
                >
                    <PlcIndex/>
                    <PlcExpand
                        toggleOnClickRow
                        v-slots={{
                            expand: ({row}) => (
                                <PlForm column={1} disabled key={row.id}>
                                    <PlFormItem label={'普通文本'}>{row.name}</PlFormItem>
                                    <PlFormItem label={'输入框'}><PlInput disabled={false} v-model={row.name}/></PlFormItem>
                                    <PlFormItem label={'数字'}><PlNumber v-model={row.size}/></PlFormItem>
                                    <PlFormItem label={'日期'}><PlDate v-model={row.date}/></PlFormItem>
                                    <PlFormItem label={'颜色'}><PlColorPicker v-model={row.color}/></PlFormItem>
                                </PlForm>
                            )
                        }}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'大小'} field={'size'}/>
                    <PlcGroup title={'地址'} fixed={'left'}>
                        <Plc field="date" title="日期"/>
                        <Plc field="color" title="颜色"/>
                    </PlcGroup>
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'评分'} field={'star'}/>
                    <Plc title={'地址'} field={'addr'}/>

                    <Plc title={'名称'} field={'name'} fixed="right"/>
                    <PlcGroup title={'站点'} fixed={'right'}>
                        <Plc field={'url'} title={'链接'}/>
                        <Plc field={'domain'} title={'域名'}/>
                    </PlcGroup>

                    <Plc title="协议" field="protocol"/>
                    <Plc title="邮箱" field="email"/>
                    <Plc title="ip" field="ip"/>
                </PlTable>
            </DemoRow>
        </div>
    )
})
