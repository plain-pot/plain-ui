import {designPage, reactive} from "plain-design-composition";

import {DemoRow} from "../../components/DemoRow";
import useOv from "../../../src/packages/useOv";
import {PlTablePro, PlcDate, PlcInput, PlOv} from "../../../src";
import useTableOption from "../../init/useTableOption";

export const demo1 = designPage(() => {

    const {$ov} = useOv()

    return () => (
        <DemoRow title="格式化">
            <ul>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'limit_time_discount')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'luck_draw')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'full_discount')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('acct_type', 'ov_supplier')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('acct_type', 'ov_trade')}</li>
            </ul>
        </DemoRow>
    )
})

export const demo2 = designPage(() => {

    const state = reactive({
        val: undefined,
    })

    return () => <>
        <DemoRow title="数据绑定">
            <PlOv v-model={state.val} ov="promotion"/>
            <PlOv v-model={state.val} ov="promotion"/>
        </DemoRow>
    </>
})

export const demo3 = designPage(() => {

    const state = reactive({
        val: 'full_discount',
    })

    return () => <>
        <DemoRow title="有初始值">
            <PlOv v-model={state.val} ov="promotion"/>
        </DemoRow>
    </>
})

export const demo4 = designPage(() => {

    const option = useTableOption({
        title: '选项值',
        url: '/ov',
    })

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <PlcInput title="显示值" field="name"/>
                <PlcInput title="代码" field="code"/>
                <PlcInput title="类型" field="type"/>
                <PlcDate title="创建时间" field="createdAt" hideInForm width={180} editable={false} datetime/>
                <PlcInput title="说明" field="comment"/>
            </PlTablePro>
        </div>
    </>
})
