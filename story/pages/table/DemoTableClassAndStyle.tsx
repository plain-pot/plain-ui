import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import PlTable from "../../../src/packages/PlTable";
import './DemoTableClassAndStyle.scss'

// @ts-ignore
import data from '../data/data-1.json'
import Plc from "../../../src/packages/Plc";

export default designPage(() => {

    const utils = {
        rowClassFunc({data}: any) {
            const {star} = data
            return [
                'custom-row',
                `custom-row-status-${star > 5 ? 'active' : 'inactive'}`
            ]
        },
        cellClassFunc({data}: any, plc: any) {
            const {star} = data

            if (plc.props.field === 'star') {
                return [
                    'custom-cell',
                    `custom-cell-status-${star > 5 ? 'active' : 'inactive'}`
                ]
            }
        },
        cellStyleFunc({data: {star}}: any, {props: {field}}: any) {
            if (field === 'star') {
                return {
                    color: star > 5 ? '#12b4a5' : '',
                    fontWeight: star > 5 ? 'bold' : 'normal'
                }
            }
            return {}
        },
        headCellClassFunc({props: {field}}: any) {
            if (field === 'star') {
                return 'custom-head-cell-clz'
            }
        },
        headCellStyleFunc({props: {field}}: any) {
            if (field === 'star') {
                return {
                    backgroundColor: '#3E97EC',
                    color: 'white',
                }
            }
            return {}
        },
    }

    return () => (
        <div>
            <DemoRow title={'rowClassFunc'}>
                <DemoLine title={'评分大于5的显示背景蓝色'}/>
                <PlTable data={data} rowClassFunc={utils.rowClassFunc}>
                    <Plc field="id" title="编号"/>
                    <Plc field="size" title="大小"/>
                    <Plc field="date" title="日期"/>
                    <Plc field="color" title="颜色"/>
                    <Plc field="name" title="名称"/>
                    <Plc field="star" title="评分"/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'cellClassFunc'}>
                <DemoLine title={'评分大于5的显示背景蓝色'}/>
                <PlTable data={data} cellClassFunc={utils.cellClassFunc}>
                    <Plc field="id" title="编号"/>
                    <Plc field="size" title="大小"/>
                    <Plc field="date" title="日期"/>
                    <Plc field="color" title="颜色"/>
                    <Plc field="name" title="名称"/>
                    <Plc field="star" title="评分"/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'cellStyleFunc'}>
                <DemoLine title={'评分大于5的蓝色加粗字体'}/>
                <PlTable data={data} cellStyleFunc={utils.cellStyleFunc}>
                    <Plc field="id" title="编号"/>
                    <Plc field="size" title="大小"/>
                    <Plc field="date" title="日期"/>
                    <Plc field="color" title="颜色"/>
                    <Plc field="name" title="名称"/>
                    <Plc field="star" title="评分"/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'headCellClassFunc'}>
                <DemoLine title={'评分大于5的蓝色加粗字体'}/>
                <PlTable data={data} headCellClassFunc={utils.headCellClassFunc}>
                    <Plc field="id" title="编号"/>
                    <Plc field="size" title="大小"/>
                    <Plc field="date" title="日期"/>
                    <Plc field="color" title="颜色"/>
                    <Plc field="name" title="名称"/>
                    <Plc field="star" title="评分"/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'headCellStyleFunc'}>
                <DemoLine title={'评分大于5的蓝色加粗字体'}/>
                <PlTable data={data} headCellStyleFunc={utils.headCellStyleFunc}>
                    <Plc field="id" title="编号"/>
                    <Plc field="size" title="大小"/>
                    <Plc field="date" title="日期"/>
                    <Plc field="color" title="颜色"/>
                    <Plc field="name" title="名称"/>
                    <Plc field="star" title="评分"/>
                </PlTable>
            </DemoRow>
        </div>
    )
})
