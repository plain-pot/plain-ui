import {designPage} from "plain-design-composition";
// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import {reactive} from "plain-design-composition";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlNumber} from "../../../src/packages/PlNumber";
import PlToggle from "../../../src/packages/PlToggle";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import PlcGroup from "../../../src/packages/PlTable/plc/core/PlcGroup";
import Plc from "../../../src/packages/Plc";
import {PlcIndex} from "../../../src/packages/PlcIndex";

export default designPage(() => {

    const state = reactive({
        data,
        destroy: false,
        summaryData: [
            {
                "id": 0,
                "color": "#79f285",
                "name": "Lisa",
                "date": "2002-04-28",
                "star": "★★★★★★★",
                "size": 49
            },
            {
                "id": 1,
                "color": "#f27990",
                "name": "George",
                "date": "2019-01-06",
                "star": "★★★★★★★★",
                "size": 74
            },
        ],
        other: {
            hasSummaryData: true,
            groupHead: false,
        },
        props: {
            headRowHeight: 45,
            bodyRowHeight: 40,
            border: false,
            virtual: false,
        },
        plc: {
            width: 200,
            align: 'left',
            init: true,
            hide: undefined,
        },
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlForm column={1}>
                    <PlFormItem>
                        <PlCheckbox v-model={state.destroy} label={'销毁表格'}/>
                    </PlFormItem>
                    <PlFormItem label={'列宽度响应测试'}>
                        <PlNumber v-model={state.plc.width} step={100}/>
                    </PlFormItem>
                    <PlFormItem label="表头行高">
                        <PlNumber v-model={state.props.headRowHeight} step={5}/>
                    </PlFormItem>
                    <PlFormItem label="表体行高">
                        <PlNumber v-model={state.props.bodyRowHeight} step={5}/>
                    </PlFormItem>
                    <PlFormItem label="列销毁测试(名称)">
                        <PlToggle v-model={state.plc.init}/>
                    </PlFormItem>
                    <PlFormItem label="带边框">
                        <PlCheckbox v-model={state.props.border}/>
                    </PlFormItem>
                    <PlFormItem label="合计行">
                        <PlToggle v-model={state.other.hasSummaryData}/>
                    </PlFormItem>
                    <PlFormItem label="表头分组">
                        <PlToggle v-model={state.other.groupHead}/>
                    </PlFormItem>
                    <PlFormItem label="启用虚拟滚动">
                        <PlToggle v-model={state.props.virtual}/>
                    </PlFormItem>
                    {!!state.other.groupHead && <>
                        <PlFormItem label="hide:(评分)">
                            <PlToggle v-model={state.plc.hide}/>
                        </PlFormItem>
                    </>}
                </PlForm>
            </DemoRow>
            <DemoRow title={'作用域插槽'}>
                {!state.destroy &&
                <PlTable
                    key={state.other.groupHead ? '1' : '2'}
                    data={data}
                    summaryData={state.other.hasSummaryData ? state.summaryData : undefined}
                    {...state.props}>

                    {!!state.other.groupHead && <>
                        <Plc title={'编号'}
                             field={'id'}
                             fixed={'left'}
                             width={state.plc.width}
                             v-slots={{
                                 head: ({plc}) => (<span>id标题:{plc.props.title}</span>),
                                 normal: ({row}) => (<span>id:{row.id}</span>),
                                 summary: ({row}) => (<span>smy:{row.id}</span>),
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

                        {state.plc.init && <Plc title={'名称'} field={'name'}/>}
                        <PlcGroup title={'站点'} fixed={'right'}>
                            <Plc field={'url'} title={'链接'}/>
                            <Plc field={'domain'} title={'域名'}/>
                        </PlcGroup>

                        <Plc title="协议" field="protocol"/>
                        <Plc title="邮箱" field="email"/>
                        <Plc title="ip" field="ip"/>
                    </>}
                    {!state.other.groupHead && <>
                        <PlcIndex/>
                        <Plc field="id" title="编号" fixed={'left'}/>
                        <Plc
                            field="size"
                            title="大小"
                            v-slots={{
                                head: ({plc}) => (<span>size:{plc.props.title}</span>),
                                normal: ({row}) => (<span>size:{row.id}</span>),
                                summary: ({row}) => (<span>smy size:{row.id}</span>),
                            }}
                        />
                        <Plc field="date" title="日期"/>
                        <Plc field="color" title="颜色"/>
                        {!!state.plc.init && <Plc field="name" title="名称" fixed={'right'}/>}
                        <Plc field="star" title="评分"/>
                        <Plc field="addr" title="地址"/>
                        <Plc field="url" title="链接"/>
                        <Plc field="domain" title="域名"/>
                        <Plc field="protocol" title="协议"/>
                        <Plc field="email" title="邮箱"/>
                        <Plc field="ip" title="ip"/>
                    </>}
                </PlTable>}
            </DemoRow>
        </div>
    )
})
