import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlTime from "../../../src/packages/PlTime";
import PlButton from "../../../src/packages/PlButton";
import {DemoLine} from "../../components/DemoLine";
import {PlInput} from "../../../src/packages/PlInput";
import {PDate} from "../../../src/utils/plainDate";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const val = reactive({val: {} as any}).val
    const setTime = () => val[18] = PlTime.plainDate.today('HH:mm:ss', 'HH:mm:ss').getValue()

    const custom = (layout: string, value: PDate | null) => {

        let five = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
        let ten = [0, 10, 20, 30, 40, 50]

        if (layout === 'h') {
            return [8, 9, 10, 11, 13, 15, 17]
        }
        if (layout === 'm') {
            if (!value) {
                return []
            }
            return value.hour > 12 ? ten : five
        }
    }

    return () => (
        <div>
            <DemoRow title={'额外内容'}>
                <DemoLine>{val[18]}</DemoLine>
                <PlTime
                    v-model={val[18]}
                    v-slots={{
                        foot: () => <PlButton mode={'text'} size={'mini'} onClick={setTime} label={'现在'}/>,
                    }}
                />
                <PlInput style={{display: 'block'}}/>
            </DemoRow>
            <DemoRow title={'获取焦点'}>
                <PlTime onFocus={() => console.log('focus')} onBlur={() => console.log('blue')}/>
                <PlTime onFocus={() => console.log('focus')} onBlur={() => console.log('blue')} range/>
            </DemoRow>
            <DemoRow title={'基本用法'}>
                <DemoLine>{val[0]}</DemoLine>
                <PlTime v-model={val[0]}/>
                <PlTime v-model={val[0]}/>
            </DemoRow>
            <DemoRow title={'时间范围'}>
                <DemoLine>start:{val[19]},end:{val[20]}</DemoLine>
                <PlTime v-models={[[val[19], 'start'], [val[20], 'end']]} range/>
                <PlTime v-models={[[val[19], 'start'], [val[20], 'end']]} range/>
            </DemoRow>
            <DemoRow title={'格式化值以及显示值'}>
                <DemoRow title={'单值'}>
                    <DemoLine>{val[33]}</DemoLine>
                    <PlTime v-model={val[33]} displayFormat="HH时mm分ss秒" valueFormat="HHmmss"/>
                </DemoRow>
                <DemoRow title={'范围'}>
                    <DemoLine>start:{val[34]},end:{val[35]}</DemoLine>
                    <PlTime v-models={[[val[34], 'start'], [val[35], 'end']]} range displayFormat="HH时mm分ss秒" valueFormat="HHmmss"/>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'最大最小值'}>
                <DemoLine>
                    max="121212" min="040404"
                </DemoLine>
                <DemoRow title={'单值'}>
                    <DemoLine>{val[36]}</DemoLine>
                    <PlTime v-model={val[36]} displayFormat="HH时mm分ss秒" valueFormat="HHmmss" max="121212" min="040404"/>
                </DemoRow>
                <DemoRow title={'范围'}>
                    <DemoLine>start:{val[37]},end:{val[38]}</DemoLine>
                    <PlTime v-models={[[val[37], 'start'], [val[38], 'end']]} range displayFormat="HH时mm分ss秒" valueFormat="HHmmss" max="121212" min="040404"/>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'四种视图'}>
                <DemoRow title={'时'}>
                    <DemoLine>{val[39]}</DemoLine>
                    <PlTime v-model={val[39]} valueFormat="HH" displayFormat="HH时" layout={['h']}/>
                </DemoRow>
                <DemoRow title={'时分'}>
                    <DemoLine>{val[40]}</DemoLine>
                    <PlTime v-model={val[40]} valueFormat="HHmm" displayFormat="HH时mm分" layout={['h', 'm']}/>
                </DemoRow>
                <DemoRow title={'时分秒'}>
                    <DemoLine>{val[41]}</DemoLine>
                    <PlTime v-model={val[41]}/>
                </DemoRow>
                <DemoRow title={'分秒'}>
                    <DemoLine>{val[42]}</DemoLine>
                    <PlTime v-model={val[42]} valueFormat="mmss" displayFormat="mm分ss秒" layout={['m', 's']}/>
                </DemoRow>

            </DemoRow>
            <DemoRow title={'自定义可选时间点'}>
                <DemoRow title={'时分'}>
                    <DemoLine>{val[40]}</DemoLine>
                    <PlTime v-model={val[40]} valueFormat="HHmm" displayFormat="HH时mm分" layout={['h', 'm']} custom={custom}/>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'只读以及禁用'}>
                <DemoLine>
                    <PlCheckbox label={'只读/禁用'} v-model={val[44]}/>
                </DemoLine>
                <PlTime v-model={val[46]} disabled={val[44]} placeholder={'禁用'}/>
                <PlTime v-model={val[46]} readonly={val[44]} placeholder={'只读'}/>
            </DemoRow>
        </div>
    )
})
