import {designPage, reactive} from "plain-ui-composition";

import {DemoRow} from "../../components/DemoRow";
import {PlDateRange, PlSelectOption} from "../../../src";
import PlFilter from "../../../src/packages/PlFilter";
import {FilterConfig} from "../../../src/packages/PlFilter/FilterConfig";

export default designPage(() => {
    const state = reactive({
        textFilterOption: {
            label: '',
            field: 'normalText',
            filterName: 'text',
            handlerName: '类似',
            filterConfig: {},
            value: null,
        },
        selectFilterOption: {
            label: '',
            field: 'selectVal',
            filterName: 'select',
            handlerName: '等于',
            filterConfig: {
                options: () => <>
                    <PlSelectOption label="会员积分提醒" val="member"/>
                    <PlSelectOption label="物流中转通知" val="logistics"/>
                    <PlSelectOption label="新品首发通知" val="prod-launch"/>
                </>
            },
            value: null,
        },
        dateFilterOption: {
            label: '',
            field: 'dateVal',
            filterName: 'date',
            handlerName: '范围',
            filterConfig: {},
            value: null,
        }
    })
    return () => <>
        <DemoRow title="text">
            <PlFilter fto={FilterConfig.getTargetOption(state.textFilterOption)}/>
            <PlFilter fto={FilterConfig.getTargetOption(state.textFilterOption)} block/>
            <span>搜索</span>
            {JSON.stringify(state.textFilterOption)}
        </DemoRow>
        <DemoRow title="select">
            <PlFilter fto={FilterConfig.getTargetOption(state.selectFilterOption)}/>
            <PlFilter fto={FilterConfig.getTargetOption(state.selectFilterOption)} block/>
            {JSON.stringify(state.selectFilterOption)}
        </DemoRow>
        <DemoRow title="date">
            <PlFilter fto={FilterConfig.getTargetOption(state.dateFilterOption)}/>
            <PlFilter fto={FilterConfig.getTargetOption(state.dateFilterOption)} block/>
            <div style={{width: '600px'}}>
                <PlFilter fto={FilterConfig.getTargetOption(state.dateFilterOption)} block/>
            </div>
            <div>
                {JSON.stringify(state.dateFilterOption)}
            </div>
        </DemoRow>
    </>
})
