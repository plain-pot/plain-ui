import {designPage, reactive} from 'plain-ui-composition'
import {DemoRow} from "../../components/DemoRow";
import {PlRadio} from "../../../src/packages/PlRadio";
import {StorySizes, StoryStatus} from "../../story.utils";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import './DemoRadio.scss'
import {classnames} from "plain-utils/dom/classnames";

export default designPage(() => {

    const state = reactive({
        val: {} as any,
    })

    return () => (
        <div class={'demo-radio'}>
            <DemoRow title={'基本用法'}>
                <PlRadio label={'标签一'} v-model={state.val[0]}/>
                {state.val[0]}
            </DemoRow>
            <DemoRow title={'状态'}>
                {StoryStatus.map(item => (
                    <PlRadio label={item.label} status={item.status} key={item.status} modelValue={true}/>
                ))}
            </DemoRow>
            <DemoRow title={'真假值'}>
                <PlRadio label={'标签一'} trueValue={10} falseValue={20} v-model={state.val[1]}/>
                {state.val[1]}
            </DemoRow>
            <DemoRow title={'禁用'}>
                <PlRadio label={'标签一'} modelValue={true} disabled/>
                <PlRadio label={'标签一'} modelValue={false} disabled/>
            </DemoRow>
            <DemoRow title={'大小'}>
                <PlRadio label={'自定义大小'} modelValue={true} style={{fontSize: '24px'}}/>
                {StorySizes.map(item => <PlRadio label={item.label} modelValue={true} size={item.size} key={item.size}/>)}
            </DemoRow>
            <DemoRow title={'单选按钮组'}>
                <PlRadioGroup v-model={state.val[3]}>
                    <PlRadio label={'标签一'} val={'tag1'}/>
                    <PlRadio label={'标签二'} val={'tag2'}/>
                    <PlRadio label={'标签三'} val={'tag3'}/>
                </PlRadioGroup>
                {state.val[3]}
            </DemoRow>
            <DemoRow title={'单选按钮组：状态以及大小'}>
                <PlRadioGroup v-model={state.val[3]} size={'large'} status={'warn'}>
                    <PlRadio label={'标签一'} val={'tag1'}/>
                    <PlRadio label={'标签二'} val={'tag2'}/>
                    <PlRadio label={'标签三'} val={'tag3'}/>
                </PlRadioGroup>
                {state.val[3]}
            </DemoRow>
            <DemoRow title={'单选按钮组：禁用以及只读'}>
                <PlRadioGroup v-model={state.val[3]} disabled>
                    <PlRadio label={'标签一'} val={'tag1'}/>
                    <PlRadio label={'标签二'} val={'tag2'}/>
                    <PlRadio label={'标签三'} val={'tag3'}/>
                </PlRadioGroup>
                <br/>
                <br/>
                <PlRadioGroup v-model={state.val[3]} readonly>
                    <PlRadio label={'标签一'} val={'tag1'}/>
                    <PlRadio label={'标签二'} val={'tag2'}/>
                    <PlRadio label={'标签三'} val={'tag3'}/>
                </PlRadioGroup>
            </DemoRow>
            <DemoRow title={'自定义内容'}>
                <PlRadioGroup v-model={state.val[3]}>
                    <PlRadio val={'tag1'} v-slots={{
                        default: ({checked, click}) => (
                            <span class={classnames(['demo-radio-block', {'demo-radio-block-is-active': checked}])} onClick={click}>
                                标签一
                            </span>
                        )
                    }}/>
                    <PlRadio val={'tag2'} v-slots={{
                        default: ({checked, click}) => (
                            <span class={classnames(['demo-radio-block', {'demo-radio-block-is-active': checked}])} onClick={click}>
                                标签二
                            </span>
                        )
                    }}/>
                    <PlRadio val={'tag3'} v-slots={{
                        default: ({checked, click}) => (
                            <span class={classnames(['demo-radio-block', {'demo-radio-block-is-active': checked}])} onClick={click}>
                                标签三
                            </span>
                        )
                    }}/>
                </PlRadioGroup>
            </DemoRow>
        </div>
    )
})
