import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlRate} from "../../../src/packages/PlRate";
import {DemoLine} from "../../components/DemoLine";
import {StorySizes, StoryStatus} from "../../story.utils";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        val: {
            2: 3,
            20: true,
            21: 3,
            11: 2.5,
        } as any
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlRate v-model={state.val[0]}/>
                <PlRate v-model={state.val[0]}/>
                {state.val[0]}
            </DemoRow>
            <DemoRow title={'总分 total 为10分'}>
                <PlRate v-model={state.val[11]} total={10}/>
                {state.val[11]}
            </DemoRow>
            <DemoRow title={'设置星星个数 count'}>
                <PlRate v-model={state.val[11]} total={10} count={10}/>
                {state.val[11]}
            </DemoRow>
            <DemoRow title={'模式'}>
                <DemoLine title={'普通模式'}>
                    <PlRate mode={'normal'} modelValue={2.4}/>
                </DemoLine>
                <DemoLine title={'半星模式'}>
                    <PlRate mode={'half'} modelValue={5}/>
                </DemoLine>
                <DemoLine title={'整星模式'}>
                    <PlRate mode={'all'} modelValue={2}/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'状态颜色'}>
                <DemoLine title={'预定义颜色'}>{StoryStatus.map(item => <PlRate status={item.status} key={item.status} modelValue={3}/>)}</DemoLine>
                <DemoLine title={'自定义颜色'}>
                    <PlRate modelValue={3} style={{color: 'rebeccapurple'}}/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'大小'}>
                <DemoLine title={'预定义大小'}>{StorySizes.map(item => <PlRate size={item.size} key={item.size} modelValue={3}/>)}</DemoLine>
                <DemoLine title={'自定义大小'}>
                    <PlRate modelValue={3} style={{fontSize: '24px'}}/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'设置激活icon与未激活icon'}>
                <PlRate modelValue={3} activeIcon={'el-icon-folder-s'} inactiveIcon={'el-icon-folder'} status={'error'}/>
            </DemoRow>
            <DemoRow title={'禁用与只读'}>
                <PlCheckbox label={'禁用/只读'} v-model={state.val[20]}/>
                <DemoLine>
                    <PlRate v-model={state.val[21]} disabled={state.val[20]}/>
                    <PlRate v-model={state.val[21]} readonly={state.val[20]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
