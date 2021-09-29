import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import useObject from "../../../src/packages/useObject";
import {$$notice, PlButton, Plc, PlcDate, PlcInput, PlcNumber, PlObject, useObjectOption} from "../../../src";

export const demo1 = designPage(() => {

    const {$object} = useObject()

    const option = useObjectOption({
        title: '示例列表',
        url: '/demo',
        render: () => <>
            <Plc title="编号id" field="id" width={350} hideInForm/>
            <PlcDate title="创建时间" field="createdAt" hideInForm width={200} editable={false}/>
            <PlcDate title="更新时间" field="updatedAt" hideInForm width={200} editable={false}/>
            <PlcDate title="日期" field="dateVal"/>
            <PlcNumber title="计数count" field="count" required/>
            <PlcInput title="文本normalText" field="normalText" required fixed="left"/>
            {/*
            <PlcNumber title="数字numberVal" field="numberVal" required/>
            <PlcCheckbox title="复选框flag" field="flag"/>
            <PlcSelect title="下拉框selectVal" field="selectVal" required>
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
            <PlcTextarea title="长文本longText" field="longText" required/>*/}
        </>
    })

    let selectedRow: any = undefined
    const selectRow = async () => {
        selectedRow = await $object({option, selected: selectedRow})
        $$notice({message: selectedRow.normalText})
    }

    let selectedList: any[] = []
    const selectList = async () => {
        selectedList = await $object({option, selected: selectedList}, true)
        $$notice({message: selectedList.map(i => i.normalText).join(',')})
    }

    return () => <>
        <DemoRow title="选择服务">
            <PlButton onClick={selectRow} label="单选"/>
            <PlButton onClick={selectList} label="多选"/>
        </DemoRow>
    </>
})

export const demo2 = designPage(() => {

    const state = reactive({
        formData: {} as any,
    })

    const option = useObjectOption({
        title: '示例列表',
        url: '/demo',
        render: () => <>
            <Plc title="编号id" field="id" hideInForm/>
            <PlcDate title="创建时间" field="createdAt" hideInForm editable={false}/>
            <PlcDate title="更新时间" field="updatedAt" hideInForm editable={false}/>
            <PlcDate title="日期" field="dateVal"/>
            <PlcNumber title="计数count" field="count" required/>
            <PlcInput title="文本normalText" field="normalText" required fixed="left"/>
        </>
    })

    return () => <>
        <DemoRow title="PlObject">
            <PlObject option={option} row={state.formData} map={{parentId: 'id', parentName: 'normalText'}} showKey="parentName"/>
            {JSON.stringify(state.formData)}
        </DemoRow>
    </>

})


export const disabled = designPage(() => {

    const state = reactive({
        formData: {} as any,
    })

    const option = useObjectOption({
        title: '示例列表',
        url: '/demo',
        render: () => <>
            <Plc title="编号id" field="id" hideInForm/>
            <PlcDate title="创建时间" field="createdAt" hideInForm editable={false} datetime/>
            <PlcDate title="更新时间" field="updatedAt" hideInForm editable={false} datetime/>
            <PlcDate title="日期" field="dateVal"/>
            <PlcNumber title="计数count" field="count" required/>
            <PlcInput title="文本normalText" field="normalText" required fixed="left"/>
        </>
    })

    return () => <>
        <DemoRow title="PlObject：禁用与只读">
            <PlObject option={option} row={state.formData} map={{parentId: 'id', parentName: 'normalText'}} showKey="parentName"/>
            <PlObject option={option} row={state.formData} map={{parentId: 'id', parentName: 'normalText'}} showKey="parentName" disabled/>
            <PlObject option={option} row={state.formData} map={{parentId: 'id', parentName: 'normalText'}} showKey="parentName" readonly/>
            {JSON.stringify(state.formData)}
        </DemoRow>
    </>

})
