import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlTag from "../../../src/packages/PlTag";
import $$message from "../../../src/packages/$$message";
import PlIcon from "../../../src/packages/PlIcon";
import {StoryStatus} from "../../story.utils";
import PlTagInput from "../../../src/packages/PlTagInput";
import {PlInput} from "../../../src/packages/PlInput";
import PlButton from "../../../src/packages/PlButton";
import {DemoLine} from "../../components/DemoLine";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        val: {} as any,
    })

    const beforeAdd = (str: string) => {
        if (!/^\d+$/.test(str)) {
            $$message.error('请输入数字')
            return Promise.reject()
        }
    }
    const beforeRemove = (item: string, index: number) => {
        if (Number(item) > 100) {
            $$message.error('不能删除大于一百的选项')
            return Promise.reject()
        }
    }

    const formatValue = (value: string) => {
        return {
            name: value,
            icon: 'el-icon-info',
            disabled: Math.random() < 0.3,
            status: ['primary', 'success', 'warn', 'error', 'info'][Math.floor(Math.random() * 5)],
        }
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTag label={'标签'}/>
            </DemoRow>
            <DemoRow title={'删除图标'}>
                <PlTag label={'标签'} close onClick={() => $$message('click')} onClose={() => $$message.error('close')}/>
            </DemoRow>
            <DemoRow title={'插槽'}>
                <PlTag close>
                    <PlIcon icon={'el-icon-search'}/>
                    <span>标签</span>
                </PlTag>
            </DemoRow>
            <DemoRow title={'状态'}>
                {StoryStatus.map(item => <PlTag key={item.status} status={item.status} label={item.label} close/>)}
            </DemoRow>
            <DemoRow title={'类型'}>
                <PlTag label={'标签'} mode={'fill'}/>
                <PlTag label={'标签'} mode={'stroke'}/>
                <PlTag label={'标签'} mode={'text'}/>
            </DemoRow>
            <DemoRow title={'大小'}>
                <PlTag label={'大'} key={'large'} size={'large'}/>
                <PlTag label={'中'} key={'normal'} size={'normal'}/>
                <PlTag label={'小'} key={'mini'} size={'mini'}/>
            </DemoRow>
            <DemoRow title={'禁用'}>
                <PlTag label={'标签'} mode={'fill'} disabled/>
                <PlTag label={'标签'} mode={'stroke'} disabled/>
                <PlTag label={'标签'} mode={'text'} disabled/>
            </DemoRow>
            <DemoRow title={'标签输入框'}>
                <PlTagInput v-model={state.val[0]}/>
                <PlInput modelValue={'输入的内容'}/>
                <PlButton label={'按钮'}/>
                {state.val[0]}
            </DemoRow>
            <DemoRow title={'标签输入框：添加前、删除前校验'}>
                <PlTagInput v-model={state.val[1]} beforeAdd={beforeAdd} beforeRemove={beforeRemove}/>
                {state.val[1]}
            </DemoRow>
            <DemoRow title={'自定义标签内容与格式化显示值'}>
                <PlTagInput v-model={state.val[2]} formatValue={formatValue} v-slots={{
                    default: ({item, index}: any) => (
                        <PlTag key={index} status={item.status} disabled={item.disabled} close onClose={() => state.val[2].splice(index, 1)}>
                            <PlIcon icon={item.icon}/>
                            <span>{item.name}</span>
                        </PlTag>
                    )
                }}/>
                <div>
                    {JSON.stringify(state.val[2])}
                </div>
            </DemoRow>
            <DemoRow title={'禁用与只读'}>
                <PlCheckbox label={'禁用/只读'} v-model={state.val[3]}/>
                <DemoLine>
                    <PlTagInput v-model={state.val[4]} disabled={state.val[3]}/>
                </DemoLine>
                <DemoLine>
                    <PlTagInput v-model={state.val[4]} readonly={state.val[3]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
