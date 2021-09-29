import {designPage} from "plain-ui-composition";

import {reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
// @ts-ignore
import data from '../data/data.json'
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import PlToggle from "../../../src/packages/PlToggle";
import PlVirtualTable from "../../../src/packages/PlVirtualTable";

export default designPage(() => {

    const state = reactive({
        state: {
            hasSummaryData: false,
            disabled: false,
        } as any
    }).state

    const summaryData = [
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
    ]

    return () => (
        <div>
            <DemoRow>
                <PlForm>
                    <PlFormItem label={'禁用虚拟滚动'}>
                        <PlToggle v-model={state.disabled}/>
                    </PlFormItem>
                    <PlFormItem label={'合计行'}>
                        <PlToggle v-model={state.hasSummaryData}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'基本用法'}>
                <div style={{
                    overflow: 'hidden',
                    height: '410px',
                    backgroundColor: '#f6f6f6',
                }}>
                    <PlVirtualTable
                        height={400}
                        data={data}
                        size={40}
                        width={3000}
                        summaryData={state.hasSummaryData ? summaryData : undefined}
                        disabled={state.disabled}
                        v-slots={{
                            default: ({item, index}) => (
                                <tr key={index} {...{vid: index} as any} style={{backgroundColor: 'item.co'}}>
                                    <td style={{height: '40px'}}>{JSON.stringify(item)}</td>
                                </tr>
                            )
                        }}
                    />
                </div>
            </DemoRow>
        </div>
    )
})
