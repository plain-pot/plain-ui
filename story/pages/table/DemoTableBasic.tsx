import {designPage, reactive} from "plain-ui-composition";
// @ts-ignore
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import Plc from "../../../src/packages/PlTable/plc/core/Plc";
import {TableNode} from "../../../src/packages/PlTable/table/use/useTableNode";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import PlToggle from "../../../src/packages/PlToggle";
import {PlRadio} from "../../../src/packages/PlRadio";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import PlcGroup from "../../../src/packages/PlTable/plc/core/PlcGroup";

export default designPage(() => {

    const state = reactive({
        data,
        stripe: false,
        size: undefined as any,
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
            groupHead: true,
        },
        props: {
            headRowHeight: undefined,
            bodyRowHeight: undefined,
            border: false,
            virtual: false,
        },
        plc: {
            width: 200,
            align: 'left',
            init: true,
            order: 5,
            hide: undefined,
        },
        editNode: null as null | TableNode,
        onDblclickCell: (node: TableNode) => {
            console.log('node', node)
            if (!!state.editNode) {
                if (node === state.editNode) {
                    node.saveEdit()
                    node.closeEdit()
                    state.editNode = null
                    return
                } else {
                    state.editNode.cancelEdit()
                }
            }

            node.enableEdit()
            state.editNode = node
        },
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlForm column={1}>
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
                    <PlFormItem label="斑马纹">
                        <PlToggle v-model={state.stripe}/>
                    </PlFormItem>
                    <PlFormItem label="大小尺寸">
                        <PlRadioGroup v-model={state.size}>
                            <PlRadio label="large" val="large"/>
                            <PlRadio label="normal" val="normal"/>
                            <PlRadio label="mini" val="mini"/>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label="文本对齐方式">
                        <PlRadioGroup v-model={state.plc.align}>
                            <PlRadio label="left" val="left"/>
                            <PlRadio label="center" val="center"/>
                            <PlRadio label="right" val="right"/>
                        </PlRadioGroup>
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
                        <PlFormItem label="order(名称)">
                            <PlNumber v-model={state.plc.order}/>
                        </PlFormItem>
                        <PlFormItem label="hide:(评分)">
                            <PlToggle v-model={state.plc.hide}/>
                        </PlFormItem>
                    </>}
                </PlForm>
                <PlTable
                    data={data}
                    summaryData={state.other.hasSummaryData ? state.summaryData : undefined}
                    onDblclickCell={state.onDblclickCell}
                    {...state.props}
                    /*不加这个key，没有问题，还很流畅*/
                    // key={state.other.groupHead ? '1' : '2'}
                    stripe={state.stripe}
                    size={state.size}
                >

                    {!!state.other.groupHead && <>
                        <Plc title={'普通文本列'} field={'id'}/>
                        <Plc title={'设置宽度'} field={'id'} width={state.plc.width} align={state.plc.align}/>
                        <Plc title={'大小'} field={'size'} align={state.plc.align}/>
                        <PlcGroup title={'地址'} align={state.plc.align}>
                            <Plc field="date" title="日期" align={state.plc.align}/>
                            {!!state.plc.init && <Plc field="name" title="名称" align={state.plc.align}/>}
                            <Plc field="color" title="颜色" align={state.plc.align}/>
                        </PlcGroup>
                    </>}
                    {!state.other.groupHead && <>
                        <Plc field="id" title="编号(order=4)" order="4" align={state.plc.align}/>
                        <Plc field="size" title="大小" align={state.plc.align}/>
                        {!!state.plc.init && <Plc field="name" title="名称" order={state.plc.order} align={state.plc.align}/>}
                        <Plc field="date" title="日期(order=6)" order="6" align={state.plc.align}/>
                        <Plc field="color" title="颜色" align={state.plc.align}/>
                        <Plc field="star" title="评分" hide={state.plc.hide} align={state.plc.align}/>
                    </>}
                </PlTable>
            </DemoRow>
        </div>
    )
})
