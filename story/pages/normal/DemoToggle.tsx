import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlToggle from "../../../src/packages/PlToggle";
import {StoryStatus} from "../../story.utils";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {DemoLine} from "../../components/DemoLine";

export default designPage(() => {

    const state = reactive({
        val: {
            1: '',
        } as any,
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlToggle v-model={state.val[0]}/>
                <PlToggle v-model={state.val[0]}/>
                {String(state.val[0])}
            </DemoRow>
            <DemoRow title={'真假值'}>
                <PlToggle v-model={state.val[1]} trueValue={10} falseValue={20}/>
                {state.val[1]}
            </DemoRow>
            <DemoRow title={'状态'}>
                {StoryStatus.map(item => (
                    <PlToggle modelValue={true} status={item.status} key={item.status}/>
                ))}
            </DemoRow>
            <DemoRow title={'大小'}>
                <PlToggle modelValue={true} size={'large'}/>
                <PlToggle modelValue={true} size={'normal'}/>
                <PlToggle modelValue={true} size={'mini'}/>
            </DemoRow>
            <DemoRow title={'只读与禁用'}>
                <PlCheckbox v-model={state.val[2]} label={'禁用/只读'}/>
                <DemoLine title={'禁用'}>
                    <PlToggle modelValue={true} disabled={state.val[2]}/>
                    <PlToggle disabled={state.val[2]}/>
                </DemoLine>
                <DemoLine title={'只读'}>
                    <PlToggle modelValue={true} readonly={state.val[2]}/>
                    <PlToggle readonly={state.val[2]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
