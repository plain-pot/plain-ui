import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlNumber} from "../../../src/packages/PlNumber";
import {DemoLine} from "../../components/DemoLine";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import $$message from "../../../src/packages/$$message";

export default designPage(() => {
    const state = reactive({
        val: {} as any
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlNumber v-model={state.val[0]}/>
                <PlNumber v-model={state.val[0]}/>
                {state.val[0]}
            </DemoRow>

            <DemoRow title={'最大最小值'}>
                <DemoLine title={'max：10'}>
                    <PlNumber v-model={state.val[1]} max={10}/>
                    {state.val[1]}
                </DemoLine>
                <DemoLine title={'min：1'}>
                    <PlNumber v-model={state.val[2]} min={1}/>
                    {state.val[2]}
                </DemoLine>
                <DemoLine title={'max：10, min：1'}>
                    <PlNumber v-model={state.val[3]} max={10} min={1}/>
                    {state.val[3]}
                </DemoLine>
            </DemoRow>

            <DemoRow title={'计步器步长 step:10'}>
                <PlNumber v-model={state.val[4]} step={10}/>
                {state.val[4]}
            </DemoRow>

            <DemoRow title={'stepStrictly，step=10; 限制只能输入计步器步长的倍数'}>
                <PlNumber v-model={state.val[5]} step={10} stepStrictly/>
                {state.val[5]}
            </DemoRow>

            <DemoRow title={'精度'}>
                <DemoLine title={'整数：precision=0'}>
                    <PlNumber v-model={state.val[6]} precision={0}/>
                    {state.val[6]}
                </DemoLine>
                <DemoLine title={'一位小数:precision = 1'}>
                    <PlNumber v-model={state.val[6]} precision={1}/>
                    {state.val[6]}
                </DemoLine>
                <DemoLine title={'两位小数:precision = 2'}>
                    <PlNumber v-model={state.val[6]} precision={2}/>
                    {state.val[6]}
                </DemoLine>
            </DemoRow>

            <DemoRow title={'隐藏操作按钮'}>
                <PlNumber hideButton v-model={state.val[7]}/>
                {state.val[7]}
            </DemoRow>

            <DemoRow title={'禁用与只读'}>
                <PlCheckbox label={'开关'} v-model={state.val[8]}/>
                <DemoLine title={'禁用'}>
                    <PlNumber disabled={state.val[8]} v-model={state.val[9]}/>
                    {state.val[9]}
                </DemoLine>
                <DemoLine title={'只读'}>
                    <PlNumber readonly={state.val[8]} v-model={state.val[10]}/>
                    {state.val[10]}
                </DemoLine>
            </DemoRow>

            <DemoRow title={'大小，形状以及状态'}>
                <PlNumber size={'mini'} shape={'square'} status={'success'} {...{width: '120px'} as any}/>
            </DemoRow>

            <DemoRow title={'enter按键可以立即得到最新的值'}>
                <PlNumber v-model={state.val[11]} onEnter={() => $$message(state.val[11])}/>
                {state.val[11]}
            </DemoRow>
        </div>
    )
})
