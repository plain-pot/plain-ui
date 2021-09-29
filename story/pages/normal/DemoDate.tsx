import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlDatePanelYear} from "../../../src/packages/PlDate/panel/PlDatePanelYear";
import {DemoLine} from "../../components/DemoLine";
import {PlDatePanelMonth} from "../../../src/packages/PlDate/panel/PlDatePanelMonth";
import {PlDatePanelDate} from "../../../src/packages/PlDate/panel/PlDatePanelDate";
import PlDate from "../../../src/packages/PlDate";
import PlButton from "../../../src/packages/PlButton";
import PlAlert from "../../../src/packages/PlAlert";

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    function setDate(type: 'yesterday' | 'today' | 'tomorrow') {
        const pd = PlDate.plainDate.today('YYYY-MM-DD', 'YYYY-MM-DD')
        switch (type) {
            case 'yesterday':
                val[24] = pd.useMonthDate(pd.month, pd.date - 1).getValue()
                break
            case 'today':
                val[24] = pd.getValue()
                break
            case 'tomorrow':
                val[24] = pd.useMonthDate(pd.month, pd.date + 1).getValue()
                break
        }
    }

    return () => (
        <div>
            <DemoRow title={'panel'}>
                <DemoRow title={'panel year'}>
                    <DemoLine>{val[0]}</DemoLine>
                    <PlDatePanelYear v-model={val[0]}/>
                </DemoRow>
                <DemoRow title={'panel month'}>
                    <DemoLine>{val[1]}</DemoLine>
                    <PlDatePanelMonth v-model={val[1]}/>
                </DemoRow>
                <DemoRow title={'panel date'}>
                    <DemoLine>{val[2]}</DemoLine>
                    <PlDatePanelDate v-model={val[2]}/>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'PlDate'}>
                <DemoRow title={'日期选择'}>
                    <DemoRow title={'额外内容'}>
                        <DemoLine>{val[24]}</DemoLine>
                        <PlDate v-model={val[24]} popperAttrs={{placement: 'bottom-end'}} v-slots={{
                            foot: () => <>
                                <PlButton size={'mini'} label={'昨天'} onClick={() => setDate('yesterday')}/>
                                <PlButton size={'mini'} label={'今天'} onClick={() => setDate('today')}/>
                                <PlButton size={'mini'} label={'明天'} onClick={() => setDate('tomorrow')}/>
                            </>
                        }}/>
                    </DemoRow>
                    <DemoRow title={'日期'}>
                        <DemoLine>{val[24]}</DemoLine>
                        <PlDate v-model={val[24]}/>
                        <PlDate v-model={val[24]} displayFormat={'YYYY年MM月DD日'}/>
                    </DemoRow>
                    <DemoRow title={'日期时间'}>
                        <DemoLine>{val[25]}</DemoLine>
                        <PlDate v-model={val[25]} datetime/>
                        <PlDate v-model={val[25]} datetime defaultTime="08:30:00" displayFormat="YYYY年MM月DD日 HH时mm分ss秒"/>
                    </DemoRow>
                    <DemoRow title={'多选'}>
                        <DemoLine>{JSON.stringify(val[26])}</DemoLine>
                        <PlDate v-model={val[26]} multiple/>
                        <PlDate v-model={val[26]} multiple displayFormat="YYYY年MM月DD日" collapseTags={false}/>
                    </DemoRow>
                    <DemoRow title={'范围选择'}>
                        <DemoLine>start:{val[27]}, end:{val[28]}</DemoLine>
                        <PlDate v-models={[[val[27], 'start'], [val[28], 'end']]} range/>
                        <PlDate v-models={[[val[27], 'start'], [val[28], 'end']]} range displayFormat="YYYY年MM月DD日"/>
                    </DemoRow>
                    <DemoRow title={'最大最小值'}>
                        <div>max:2021-05-05</div>
                        <div>min:2019-05-05</div>
                        <PlDate v-model={val[29]} max="2021-05-05" min="2019-05-05"/>
                        <div>value:{val[29]}</div>
                        <PlDate v-models={[[val[30], 'start'], [val[31], 'end']]} range max="2021-05-05" min="2019-05-05"/>
                        <div>start:{val[30]}</div>
                        <div>end:{val[31]}</div>
                        <PlAlert>设置最大最小值之后，除了面板中的日期会标记为不可选的状态之外，在输入框中手动输入的值也会受最大最小值限制</PlAlert>
                    </DemoRow>
                    <DemoRow title={'最大最小值：日期时间'}>
                        <div>max:2021-05-05 12:00:00</div>
                        <div>min:2019-05-05 08:30:15</div>
                        <PlDate v-model={val[32]}
                                datetime
                                defaultTime="08:30:00"
                                max="2021-05-05 12:00:00"
                                min="2019-05-05 08:30:15"/>
                        <div>value:{val[32]}</div>
                        <PlDate v-models={[[val[33], 'start'], [val[34], 'end']]}
                                range
                                datetime
                                defaultStartTime="08:30:00"
                                defaultEndTime="22:00:00"
                                max="2021-05-05 12:00:00"
                                min="2019-05-05 08:30:15"/>
                        <div>start:{val[33]}</div>
                        <div>end:{val[34]}</div>
                        <PlAlert>
                            设置defaultStartTie以及defaultEndTime可以设置日期时间范围选择的默认开始时间以及结束时间
                        </PlAlert>
                    </DemoRow>
                </DemoRow>
                <DemoRow title={'年份'}>
                    <DemoRow title="基本单选">
                        <PlDate v-model={val[35]} panel="year"/>
                        <PlDate v-model={val[35]} panel="year" displayFormat="YYYY年"/>
                        <div>value:{val[35]}</div>
                    </DemoRow>
                    <DemoRow title="多选">
                        <PlDate v-model={val[36]} panel="year" multiple/>
                        <PlDate v-model={val[36]} panel="year" multiple displayFormat="YYYY年" collapseTags={false}/>
                        <div>value:{val[36]}</div>
                    </DemoRow>
                    <DemoRow title="范围选择">
                        <PlDate v-models={[[val[37], 'start'], [val[38], 'end']]} range panel="year"/>
                        <PlDate v-models={[[val[37], 'start'], [val[38], 'end']]} range panel="year" displayFormat="YYYY年"/>
                        <div>start:{val[37]}</div>
                        <div>end:{val[38]}</div>
                    </DemoRow>
                    <DemoRow title="最大最小值限制">
                        <div>max:2050</div>
                        <div>min:2019</div>
                        <PlDate v-model={val[39]} panel="year" max="2050" min="2019"/>
                        <div>value:{val[39]}</div>
                        <PlDate v-models={[[val[40], 'start'], [val[41], 'end']]} range panel="year" max="2050" min="2019"/>
                        <div>start{val[40]}</div>
                        <div>end:{val[41]}</div>
                    </DemoRow>
                </DemoRow>
                <DemoRow title="年月">
                    <DemoRow title="基本单选">
                        <PlDate v-model={val[42]} panel="month"/>
                        <PlDate v-model={val[42]} panel="month" displayFormat="YYYY年MM月"/>
                        <div>value:{val[42]}</div>
                    </DemoRow>
                    <DemoRow title="多选">
                        <PlDate v-model={val[43]} panel="month" multiple/>
                        <PlDate v-model={val[43]} panel="month" multiple displayFormat="YYYY年MM月"/>
                        <div>value:{val[43]}</div>
                    </DemoRow>
                    <DemoRow title="范围选择">
                        <PlDate v-models={[[val[44], 'start'], [val[45], 'end']]} range panel="month"/>
                        <PlDate v-models={[[val[44], 'start'], [val[45], 'end']]} range panel="month" displayFormat="YYYY年MM月"/>
                        <div>start:{val[44]}</div>
                        <div>end:{val[45]}</div>
                    </DemoRow>
                    <DemoRow title="最大最小值限制">
                        <div>max:2050-05</div>
                        <div>min:2019-03</div>
                        <PlDate v-model={val[46]} panel="month" max="2050-05" min="2019-03"/>
                        <div>value:{val[46]}</div>
                        <PlDate v-models={[[val[47], 'start'], [val[48], 'end']]} range panel="month" max="2050-05" min="2019-03"/>
                        <div>start:{val[47]}</div>
                        <div>end:{val[48]}</div>
                    </DemoRow>
                </DemoRow>
                <DemoRow title="周">
                    <DemoRow title="基本单选">
                        <PlDate v-model={val[49]} panel="week"/>
                        <PlDate v-model={val[49]} panel="week" displayFormat="年：gggg, 周：ww"/>
                        <div>value:{val[49]}</div>
                    </DemoRow>
                    <DemoRow title="多选">
                        <PlDate v-model={val[50]} panel="week" multiple/>
                        <PlDate v-model={val[50]} panel="week" multiple displayFormat="年：gggg, 周：ww"/>
                        <div>value:{val[50]}</div>
                    </DemoRow>
                    <DemoRow title="范围选择">
                        <PlDate v-models={[[val[51], 'start'], [val[52], 'end']]} range panel="week"/>
                        <PlDate v-models={[[val[51], 'start'], [val[52], 'end']]} range panel="week" displayFormat="年：gggg, 周：ww"/>
                        <div>start:{val[51]}</div>
                        <div>end:{val[52]}</div>
                    </DemoRow>
                    <DemoRow title="最大最小值限制">
                        <div>max:2050-05-05</div>
                        <div>min:2019-03-03</div>
                        <PlDate v-model={val[53]} panel="week" max="2050-05-05" min="2019-03-03"/>
                        <div>value:{val[53]}</div>
                        <PlDate v-models={[[val[54], 'start'], [val[55], 'end']]} range panel="week" max="2050-05-05" min="2019-03-03"/>
                        <div>start:{val[54]}</div>
                        <div>end:{val[55]}</div>
                    </DemoRow>
                </DemoRow>
                <DemoRow title="季度">
                    <DemoRow title="基本单选">
                        <PlDate v-model={val[56]} panel="quarter"/>
                        <PlDate v-model={val[56]} panel="quarter" displayFormat="年：YYYY, 季度：Q"/>
                        <div>value:{val[56]}</div>
                    </DemoRow>
                    <DemoRow title="多选">
                        <PlDate v-model={val[57]} panel="quarter" multiple/>
                        <PlDate v-model={val[57]} panel="quarter" multiple displayFormat="年：YYYY, 季度：Q"/>
                        <div>value:{val[57]}</div>
                    </DemoRow>
                    <DemoRow title="范围选择">
                        <PlDate v-models={[[val[58], 'start'], [val[59], 'end']]} range panel="quarter"/>
                        <PlDate v-models={[[val[58], 'start'], [val[59], 'end']]} range panel="quarter" displayFormat="年：YYYY, 季度：Q"/>
                        <div>start:{val[58]}</div>
                        <div>end:{val[59]}</div>
                    </DemoRow>
                    <DemoRow title="最大最小值限制">
                        <div>max:2050-05</div>
                        <div>min:2019-04</div>
                        <PlDate v-model={val[60]} panel="quarter" max="2050-05" min="2019-04"/>
                        <div>value:{val[60]}</div>
                        <PlDate v-models={[[val[61], 'start'], [val[62], 'end']]} range panel="quarter" max="2050-05" min="2019-04"/>
                        <div>start:{val[61]}</div>
                        <div>end:{val[62]}</div>
                    </DemoRow>
                </DemoRow>
            </DemoRow>
        </div>
    )
})
