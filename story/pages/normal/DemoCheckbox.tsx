import {designPage, reactive} from "plain-design-composition"
import {DemoRow} from "../../components/DemoRow";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {StoryStatus} from "../../story.utils";
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import './DemoCheckbox.scss'
import {classnames} from "plain-utils/dom/classnames";

export default designPage(() => {

    const state = reactive({
        val: {
            1: true,
        } as any,
    })

    return () => (
        <div class={'demo-checkbox'}>
            <DemoRow title={'基本用法'}>
                <PlCheckbox v-model={state.val[0]} label={'标签一'}/>
                <PlCheckbox v-model={state.val[0]} label={'标签二'}/>
                &nbsp;&nbsp;
                {String(state.val[0])}
            </DemoRow>
            <DemoRow title={'状态'}>
                {StoryStatus.map(item => <PlCheckbox key={item.status} label={item.label} status={item.status} modelValue={true}/>)}
            </DemoRow>
            <DemoRow title={'禁用'}>
                <PlCheckbox modelValue={true} label={'标签一'} disabled={state.val[1]}/>
                <PlCheckbox modelValue={false} label={'标签二'} disabled={state.val[1]}/>
                <PlCheckbox label={'禁用'} v-model={state.val[1]}/>
            </DemoRow>
            <DemoRow title={'真假值'}>
                <PlCheckbox label={'标签一'} trueValue={10} falseValue={20} v-model={state.val[2]}/>
                {state.val[2]}
            </DemoRow>
            <DemoRow title={'大小'}>
                <PlCheckbox label={'mini'} size={'mini'} v-model={state.val[3]}/>
                <PlCheckbox label={'normal'} size={'normal'} v-model={state.val[3]}/>
                <PlCheckbox label={'large'} size={'large'} v-model={state.val[3]}/>
                <PlCheckbox label={'custom'} v-model={state.val[3]} style={{fontSize: '24px'}}/>
            </DemoRow>
            <DemoRow title={'复选框组'}>
                <PlCheckboxGroup v-model={state.val[4]}>
                    <PlCheckbox checkboxForAll label={'全选'}/>
                    <PlCheckbox label={'标签一'} val={'tag1'}/>
                    <PlCheckbox label={'标签二'} val={'tag2'}/>
                    <PlCheckbox label={'标签三'} val={'tag3'}/>
                </PlCheckboxGroup>
                {state.val[4]}
            </DemoRow>
            <DemoRow title={'自定义渲染内容'}>
                <h4>自定义内容</h4>
                <PlCheckboxGroup v-model={state.val[4]}>
                    <PlCheckbox checkboxForAll v-slots={{
                        default: ({status, click}) => (
                            <div onClick={click} class={classnames(['demo-checkbox-custom-item', {'demo-checkbox-custom-item-active': status === 'check'}])}>
                                {({
                                    check: '以全选',
                                    uncheck: '未选中',
                                    minus: '半选',
                                })[status]}
                            </div>
                        )
                    }}/>
                    {['tag1', 'tag2', 'tag3'].map(tag => (
                        <PlCheckbox val={tag} key={tag} v-slots={{
                            default: ({checked, click}) => (
                                <div
                                    onClick={click}
                                    class={classnames([
                                        'demo-checkbox-custom-item',
                                        {'demo-checkbox-custom-item-active': checked},
                                    ])}>
                                    {tag}
                                </div>
                            )
                        }}/>
                    ))}
                </PlCheckboxGroup>
            </DemoRow>

            <DemoRow title={'复选框组：状态以及大小'}>
                <PlCheckboxGroup status={'warn'} size={'large'}>
                    <PlCheckbox checkboxForAll label={'全选'}/>
                    <PlCheckbox label={'标签一'} val={'tag1'}/>
                    <PlCheckbox label={'标签二'} val={'tag2'}/>
                    <PlCheckbox label={'标签三'} val={'tag3'}/>
                </PlCheckboxGroup>
            </DemoRow>
            <DemoRow title={'复选框组：禁用以及只读'}>
                <PlCheckboxGroup disabled>
                    <PlCheckbox checkboxForAll label={'全选'}/>
                    <PlCheckbox label={'标签一'} val={'tag1'}/>
                    <PlCheckbox label={'标签二'} val={'tag2'}/>
                    <PlCheckbox label={'标签三'} val={'tag3'}/>
                </PlCheckboxGroup>
                <br/>
                <br/>
                <PlCheckboxGroup readonly>
                    <PlCheckbox checkboxForAll label={'全选'}/>
                    <PlCheckbox label={'标签一'} val={'tag1'}/>
                    <PlCheckbox label={'标签二'} val={'tag2'}/>
                    <PlCheckbox label={'标签三'} val={'tag3'}/>
                </PlCheckboxGroup>
            </DemoRow>

            <DemoRow title={'复选框组：最大最小勾选个数(全选会勾选最大可勾选个数)'}>
                <PlCheckboxGroup max={3} min={1}>
                    <PlCheckbox checkboxForAll label={'全选'}/>
                    <PlCheckbox label={'标签一'} val={'tag1'}/>
                    <PlCheckbox label={'标签二'} val={'tag2'}/>
                    <PlCheckbox label={'标签三'} val={'tag3'}/>
                    <PlCheckbox label={'标签四'} val={'tag4'}/>
                    <PlCheckbox label={'标签五'} val={'tag5'}/>
                </PlCheckboxGroup>
            </DemoRow>

            <DemoRow title={'设置选项宽度使其对其'}>
                <div style={{width: '300px'}}>
                    <PlCheckboxGroup itemWidth={'50%'}>
                        <PlCheckbox checkboxForAll label={'全选'}/>
                        <PlCheckbox label={'标签一'} val={'tag1'}/>
                        <PlCheckbox label={'标签二'} val={'tag2'}/>
                        <PlCheckbox label={'标签三'} val={'tag3'}/>
                        <PlCheckbox label={'标签四'} val={'tag4'}/>
                        <PlCheckbox label={'标签五'} val={'tag5'}/>
                    </PlCheckboxGroup>
                </div>
            </DemoRow>
        </div>
    )
})
