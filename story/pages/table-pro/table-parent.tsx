import {designPage} from "plain-ui-composition";

import useTableOption from "../../init/useTableOption";
import {useNotice, PlcInput, PlTablePro, useHttp} from "../../../src";
import {DemoRow} from "../../components/DemoRow";
import {PlainObject} from "../../../src/packages/createUseTableOption/createUseTableOption.utils";

export const demo1 = designPage(() => {

    const $notice = useNotice()
    const http = useHttp()
    const checkNewCode = async (row: PlainObject) => {
        const {code, name, id} = row

        const filterCode = {id: 'check_code', field: 'code', value: code, operator: '='}
        const filterName = {id: 'check_name', field: 'name', value: name, operator: '='}
        const filterId = {id: 'check_id', field: 'id', value: [id], operator: '!='}

        const {list} = await http.post('/address/list', {
            ...!id ? {
                filters: [filterCode, filterName],
                filterExpression: '(check_code or check_name)',
            } : {
                filters: [filterCode, filterName, filterId],
                filterExpression: '(check_code or check_name) and (check_id)',
            },
        })
        if (list.length > 0) {
            $notice.error('地址代码或者地址名称唯一性冲突！')
            return Promise.reject()
        }
    }

    const provinceOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        defaultNewRow: {deep: 0,},
        showRows: 5,
    })

    const cityOption = useTableOption({
        url: '/address',
        showRows: 5,
        defaultNewRow: {deep: 1,},
        parentOption: provinceOption,
        parentMap: {parentName: 'name', parentCode: 'code'},
    })

    const districtOption = useTableOption({
        url: '/address',
        showRows: 5,
        defaultNewRow: {deep: 2,},
        parentOption: cityOption,
        parentMap: {parentName: 'name', parentCode: 'code'},
    })

    provinceOption.hooks.onBeforeSaveRow.use(row => checkNewCode(row))
    cityOption.hooks.onBeforeSaveRow.use(row => checkNewCode(row))
    districtOption.hooks.onBeforeSaveRow.use(row => checkNewCode(row))

    return () => <>
        <DemoRow title="基本用法">
            <PlTablePro option={provinceOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
            </PlTablePro>
            <PlTablePro option={cityOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                {/*<PlcInput title="父级地址名称" field="parentName"/>*/}
                {/*<PlcInput title="父级地址代码" field="parentCode"/>*/}
            </PlTablePro>
            <PlTablePro option={districtOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                {/*<PlcInput title="父级地址名称" field="parentName"/>*/}
                {/*<PlcInput title="父级地址代码" field="parentCode"/>*/}
            </PlTablePro>
        </DemoRow>
    </>

})
