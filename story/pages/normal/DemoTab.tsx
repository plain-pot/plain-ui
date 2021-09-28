import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import PlTabs from "../../../src/packages/PlTabs";
import PlTab from "../../../src/packages/PlTab";
import PlInput from "../../../src/packages/PlInput";
import PlRadioGroup from "../../../src/packages/PlRadioGroup";
import PlRadio from "../../../src/packages/PlRadio";
import {Fragment} from 'vue'
import useDialog from "../../../src/packages/useDialog";
import PlButton from "../../../src/packages/PlButton";

export const DemoBasic = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs headType="text">
                <PlTab title="用户管理" style={{backgroundColor: '#fcfcfb'}}>
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput onVnodeMounted={() => console.log('111 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput onVnodeMounted={() => console.log('222 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput onVnodeMounted={() => console.log('333 mounted')}/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoDirection = designPage(() => {
    const state = reactive({
        position: 'top'
    })

    return () => (
        <DemoRow title="方向">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any}>
                <PlTab title="用户管理">
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoHeadType = designPage(() => {
    const state = reactive({
        position: 'top',
        headType: 'text',
    })

    return () => (
        <DemoRow title="页签类型">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <DemoLine>
                <PlRadioGroup v-model={state.headType}>
                    <PlRadio val="text" label="text"/>
                    <PlRadio val="card" label="card"/>
                    <PlRadio val="shadow" label="shadow"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any} headType={state.headType as any}>
                <PlTab title="用户管理">
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoLongTabs = designPage(() => {

    const state = reactive({
        position: 'top',
        headType: 'text',
    })

    return () => (
        <DemoRow title="超长页签">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <DemoLine>
                <PlRadioGroup v-model={state.headType}>
                    <PlRadio val="text" label="text"/>
                    <PlRadio val="card" label="card"/>
                    <PlRadio val="shadow" label="shadow"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any} headType={state.headType as any}>
                {new Array(10).fill(0).map((_, index) => (
                    <Fragment key={index}>
                        <PlTab title={`用户管理_${index}`}>
                            <div style={{height: '100px', backgroundColor: '#f5f5f5'}}>
                                {`user management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`配置管理_${index}`}>
                            <div style={{height: '200px', backgroundColor: '#f9f9f9'}}>
                                {`config management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`数据集管理_${index}`}>
                            <div style={{height: '300px', backgroundColor: '#ffffff'}}>
                                {`data map_${index}`}
                            </div>
                        </PlTab>
                    </Fragment>
                ))}
            </PlTabs>
        </DemoRow>
    )
})


export const DemoDynamic = designPage(() => {

    const state = reactive({
        tabs: [
            '用户管理',
            '配置管理',
            '数据集管理',
            '网点管理',
            // 以下数据用来模拟超长数据
            /*'价格配置',
            '系统配置',
            '开发配置',
            '参数配置',
            '装修配置',
            '源点配置',
            '网站地图',
            '黑名单',
            '白名单',
            '工作流',
            '审批流',*/
        ],
    })

    const dialog = useDialog()

    const addTab = () => {
        dialog({
            editType: 'input',
            confirmButton: true,
            cancelButton: true,
            onConfirm: editValue => {
                editValue = editValue?.trim()
                if (!editValue) {
                    return
                }
                if (state.tabs.indexOf(editValue) > -1) {
                    dialog.warn('唯一性冲突！')
                    return
                }
                state.tabs.unshift(editValue)
            }
        })
    }

    const resetTabData = () => {
        const data = [
            '用户管理',
            '配置管理',
            '数据集管理',
            '网点管理',
            '价格配置',
            '系统配置',
            '开发配置',
            '参数配置',
            '装修配置',
            '源点配置',
            '网站地图',
            '黑名单',
            '白名单',
            '工作流',
            '审批流',
        ]
        state.tabs = state.tabs.length <= 4 ? data : data.slice(0, 4)
    }

    return () => (
        <DemoRow title="动态增减标签页">
            <PlTabs closeable>
                {{
                    default: () => state.tabs.map((tab, index) => (
                        <PlTab key={tab} title={tab} onClose={() => state.tabs.splice(index, 1)}>
                            <div style={{height: '100px', padding: '20px 0'}}>
                                {tab}：
                                <PlInput/>
                            </div>
                        </PlTab>
                    )),
                    operator: () => (
                        <>
                            <PlButton label="新页签" icon="el-icon-plus" onClick={addTab}/>
                            <PlButton mode="stroke" label={state.tabs.length > 4 ? '短页签' : '长页签'} status="error" onClick={resetTabData}/>
                        </>
                    )
                }}
            </PlTabs>
        </DemoRow>
    )
})

export const DemoFitHeight = designPage(() => {
    const state = reactive({
        position: 'top',
        headType: 'text',

    })

    return () => (
        <DemoRow title="固定高度">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <DemoLine>
                <PlRadioGroup v-model={state.headType}>
                    <PlRadio val="text" label="text"/>
                    <PlRadio val="card" label="card"/>
                    <PlRadio val="shadow" label="shadow"/>
                </PlRadioGroup>
            </DemoLine>
            <div style={{height: '200px'}}>
                <PlTabs headPosition={state.position as any} headType={state.headType as any} fitHeight>
                    {new Array(10).fill(0).map((_, index) => (
                        <Fragment key={index}>
                            <PlTab title={`用户管理_${index}`}>
                                <div style={{height: '200px', backgroundColor: '#ffffff'}}>
                                    {`user management_${index}`}
                                </div>
                            </PlTab>
                            <PlTab title={`配置管理_${index}`}>
                                <div style={{height: '400px', backgroundColor: '#f9f9f9'}}>
                                    {`config management_${index}`}
                                </div>
                            </PlTab>
                            <PlTab title={`数据集管理_${index}`}>
                                <div style={{height: '600px', backgroundColor: '#f5f5f5'}}>
                                    {`data map_${index}`}
                                </div>
                            </PlTab>
                        </Fragment>
                    ))}
                </PlTabs>
            </div>
        </DemoRow>
    )
})
