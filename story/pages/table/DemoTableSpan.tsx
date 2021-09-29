
import {DemoRow} from "../../components/DemoRow";
import {designPage} from "plain-ui-composition";
import {DemoLine} from "../../components/DemoLine";
import PlTable from "../../../src/packages/PlTable";
import {TableNode} from "../../../src/packages/PlTable/table/use/useTableNode";
import Plc from "../../../src/packages/Plc";
import {PlcIndex} from "../../../src/packages/PlcIndex";

const DemoRowSpan = designPage(() => {

    const data = [
        {first: '1', second: '1-1', third: '1-1-1'},
        {first: '1', second: '1-1', third: '1-1-2'},
        {first: '1', second: '1-1', third: '1-1-3'},
        {first: '1', second: '1-2', third: '1-2-1'},
        {first: '1', second: '1-3', third: '1-3-1'},
        {first: '2', second: '2-1', third: '2-1-1'},
        {first: '2', second: '2-1', third: '2-1-2'},
        {first: '2', second: '2-2', third: '2-2-1'},
    ] as Record<string, string>[]

    const prevIndex: any = {
        first: 0,
        second: 0,
        third: 0,
    }

    const spanMap: { [k: string]: any }[] = []
    const collapseField = ['first', 'second']
    const initMap = collapseField.reduce((ret, item) => {
        ret[item] = 1
        return ret
    }, {} as Record<string, number>)

    data.forEach((item, index) => {

        const map = {...initMap}

        if (index === 0) {
            spanMap.push(map)
            return
        }

        collapseField.forEach(key => {
            if (item[key] === data[prevIndex[key]][key]) {
                spanMap[prevIndex[key]][key]++
                map[key] = 0
            } else {
                prevIndex[key] = index
            }
        })

        spanMap.push(map)
    })

    // console.log(JSON.parse(JSON.stringify(spanMap)))

    function spanMethod({node, plc}: { node: TableNode, plc: any }) {
        return {
            colspan: 1,
            rowspan: spanMap[node.index][plc.props.field!] != null ? spanMap[node.index][plc.props.field!] : 1,
        }
    }

    return () => (
        <div>
            <DemoLine>字段值相同则合并行</DemoLine>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        {JSON.stringify(item)}
                    </li>
                ))}
            </ul>
            <PlTable data={data} spanMethod={spanMethod} border>
                <PlcIndex/>
                <Plc title={'一级标题'} field={'first'}/>
                <Plc title={'二级标题'} field={'second'}/>
                <Plc title={'三级标题'} field={'third'}/>
            </PlTable>
        </div>
    )

})

const DemoColSpan = designPage(() => {

    const data = [
        {name: '产品线A', first: '盈利', second: '盈利', third: '亏损', fourth: '亏损',},
        {name: '产品线B', first: '盈利', second: '亏损', third: '亏损', fourth: '亏损',},
        {name: '产品线C', first: '盈利', second: '盈利', third: '盈利', fourth: '亏损',},
        {name: '产品线D', first: '亏损', second: '亏损', third: '亏损', fourth: '亏损',},
        {name: '产品线E', first: '盈利', second: '盈利', third: '盈利', fourth: '盈利',},
    ]

    const spanMap: Record<string, any>[] = []
    const collapseFields = ['first', 'second', 'third', 'fourth']

    data.forEach((item: any) => {
        const map: any = {}
        let prevField: any = null
        collapseFields.forEach((field, fieldIndex) => {
            if (fieldIndex === 0) {
                prevField = field
                map[field] = 1
                return
            }

            if (item[prevField] === item[field]) {
                map[field] = 0
                map[prevField]++
            } else {
                map[field] = 1
                prevField = field
            }

        })
        spanMap.push(map)
    })

    function spanMethod({node, plc}: { node: TableNode, plc: any }) {

        const {field} = plc.props

        if (field === 'name') {
            return {
                rowspan: 1,
                colspan: 1,
            }
        } else {
            return {
                rowspan: 1,
                colspan: spanMap[node.index][field]
            }
        }
    }

    return () => (
        <div>
            <DemoLine>字段值相同则合并列</DemoLine>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
            <PlTable data={data} spanMethod={spanMethod} border>
                <PlcIndex/>
                <Plc title="产品线" field="name"/>
                <Plc title="第一季度盈亏" field="first"/>
                <Plc title="第二季度盈亏" field="second"/>
                <Plc title="第三季度盈亏" field="third"/>
                <Plc title="第四季度盈亏" field="fourth"/>
            </PlTable>
        </div>
    )
})

export default () => {
    return (
        <div>
            <DemoRow title={'合并行'}>
                <DemoRowSpan/>
            </DemoRow>
            <DemoRow title={'合并列'}>
                <DemoColSpan/>
            </DemoRow>
        </div>
    )
}
