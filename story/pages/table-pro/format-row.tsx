import {designPage} from "plain-design-composition";

import useTableOption from "../../init/useTableOption";
import {PlcInput, PlcTextarea, PlTablePro} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {

    const provinceOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        defaultNewRow: {deep: 0,},
        showRows: 5,
        hooks: {
            onFormatRow: row => {
                row.formatField = `_${row.code}`
            }
        },
    })

    return () => <>
        <DemoRow title="基本用法">
            <PlTablePro option={provinceOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                <PlcTextarea title="扩展字段" field="formatField"/>
            </PlTablePro>
        </DemoRow>
    </>

})
