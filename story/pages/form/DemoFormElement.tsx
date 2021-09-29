
import {designPage, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import PlIcon from "../../../src/packages/PlIcon";
import PlTooltip from "../../../src/packages/PlTooltip";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import PlCascade from "../../../src/packages/PlCascade";
import PlToggle from "../../../src/packages/PlToggle";
import PlColorPicker from "../../../src/packages/PlColorPicker";
import PlTime from "../../../src/packages/PlTime";
import PlDate from "../../../src/packages/PlDate";
import PlButton from "../../../src/packages/PlButton";
import $$message from "../../../src/packages/$$message";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import {PlRadio} from "../../../src/packages/PlRadio";
import PlSlider from "../../../src/packages/PlSlider";
import PlTagInput from "../../../src/packages/PlTagInput";
import {PlRate} from "../../../src/packages/PlRate";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        form: PlForm
    })

    const state = reactive({
        formData: {} as any,
        disabled: undefined as undefined | boolean,
    })

    const {formData} = state

    const levelData = [
        {levelName: '一级', code: '1'},
        {levelName: '二级', code: '2'},
        {levelName: '三级', code: '3'},
    ]

    const treeData = [
        {
            id: '1',
            name: '一级 1',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                    id: '1-' + index,
                    name: '二级 1-' + index,
                    subs: [{
                        id: `1-${index}-1`,
                        name: `三级 1-${index}-1`
                    }]
                })))
            ]
        }, {
            id: '2',
            name: '一级 2',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                    id: '2-' + index,
                    name: '二级 2-' + index,
                    subs: [{
                        id: `2-${index}-1`,
                        name: `三级 2-${index}-1`
                    }]
                })))
            ]
        }, {
            id: '3',
            name: '一级 3',
            subs: [{
                id: '3-1',
                name: '二级 3-1',
                subs: [{
                    id: '3-1-1',
                    name: '三级 3-1-1'
                }, {
                    id: '3-1-2',
                    name: '三级 3-1-2'
                }]
            }, {
                id: '3-2',
                name: '二级 3-2',
                subs: [{
                    id: '3-2-1',
                    name: '三级 3-2-1'
                }]
            }]
        }]

    async function saveValidate() {
        await refs.form!.validate()
        $$message.success('校验通过')
    }

    return () => (
        <div>
            <DemoRow title={'表单组件'}>
                <PlForm ref={onRef.form} modelValue={formData} disabled={state.disabled} centerWhenSingleColumn>
                    <PlFormItem label={'普通文本框'} field={'field1'} required>
                        <PlInput v-model={formData.field1} placeholder={'请输入文本'}/>
                    </PlFormItem>
                    <PlFormItem label={'普通文本域'} field={'field2'} required>
                        <PlInput v-model={formData.field2} textarea placeholder={'请输入文本域'}/>
                    </PlFormItem>
                    <PlFormItem label={'数字框'} field={'field3'} rules={{type: 'number', max: 100, message: '最大值100'}} required>
                        {{
                            default: ()=><PlNumber v-model={formData.field3} block placeholder={'请输入数字'}/>,
                            suffix: ()=><PlTooltip message={'提示'}><PlIcon icon={'el-icon-question'}/></PlTooltip>,
                        }}
                    </PlFormItem>
                    <PlFormItem label={'复选框'} field={'field5'} rules={{min: 1, max: 3, type: 'array', message: '1-3个元素'}} required>
                        <PlCheckboxGroup v-model={formData.field5} itemWidth={'50%'}>
                            <PlCheckbox checkboxForAll label="全部"/>
                            <PlCheckbox label="大客户" val="large"/>
                            <PlCheckbox label="潜在客户" val="potential"/>
                            <PlCheckbox label="长久客户" val="long"/>
                            <PlCheckbox label="赢单客户" val="order"/>
                        </PlCheckboxGroup>
                    </PlFormItem>
                    <PlFormItem label={'下拉选项'} field={'field6'} required rules={{message: '只能选择二级', type: 'enum', enum: ['2']}}>
                        <PlSelect v-model={formData.field6} placeholder={'请选择'}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'下拉选项（多选）'} field={'field62'} required rules={{required: true, type: 'array', min: 1, message: '最少选择一项'}}>
                        <PlSelect v-model={formData.field62} placeholder={'请选择'} multiple>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'级联选择'} field={'field61'} rules={{required: true, message: '不能为空'}}>
                        <PlCascade
                            placeholder={'请选择'}
                            v-model={formData.field61}
                            data={treeData}
                            labelField={'name'}
                            keyField={'id'}
                            childrenField={'subs'}
                        />
                    </PlFormItem>
                    <PlFormItem label={'单选按钮'} field={'field9'} required>
                        <PlRadioGroup v-model={formData.field9} itemWidth="33%">
                            <PlRadio label="是" val="Y"/>
                            <PlRadio label="否" val="N"/>
                            <PlRadio label="未知" val="NO"/>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label={'开关按钮'} field={'field10'} rules={{message: '请阅读并同意使用协议', type: 'enum', enum: [true]}}>
                        <PlToggle v-model={formData.field10}/>
                    </PlFormItem>
                    <PlFormItem label={'滑块'} field={'field11'} required rules={{min: 50, type: 'number', message: '最小值50'}}>
                        <PlSlider v-model={formData.field11}/>
                    </PlFormItem>
                    <PlFormItem label={'标签输入框'} field={'field12'} required rules={[{min: 3, type: 'array', message: '最少输入3个标签'}, {max: 5, type: 'array', message: '最多5个标签'}]}>
                        <PlTagInput v-model={formData.field12} placeholder={'请选择'}/>
                    </PlFormItem>
                    <PlFormItem label={'评分'} field={'field13'} required rules={{min: 1, type: 'number', message: '最低1分'}}>
                        <PlRate v-model={formData.field13}/>
                    </PlFormItem>
                    <PlFormItem label={'颜色选择器'} field={'field14'} rules={{required: true, message: '颜色不能为空'}}>
                        <PlColorPicker v-model={formData.field14} placeholder={'请选择'}/>
                    </PlFormItem>
                    <PlFormItem label={'时间选择'} field={'field15'} required>
                        <PlTime v-model={formData.field15} placeholder={'请选择'}/>
                    </PlFormItem>
                    <PlFormItem label={'时间范围选择'} field={['field17', 'field18']} required>
                        <PlTime v-models={[[formData.field17, 'start'], [formData.field18, 'end']]} range/>
                    </PlFormItem>
                    <PlFormItem label={'日期时间选择'} field={'field19'} required>
                        <PlDate v-model={formData.field19} datetime placeholder={'请选择'}/>
                    </PlFormItem>
                    <PlFormItem label={'日期时间范围选择'} field={['field20', 'field21']} required>
                        <PlDate v-models={[[formData.field20, 'start'], [formData.field21, 'end']]} range datetime placeholder={'请选择'}/>
                    </PlFormItem>
                    <PlFormItem label="文本域" field="field22" required>
                        <PlInput textarea v-model={formData.field22}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={'校验'} onClick={saveValidate}/>
                        <PlButton label={'取消校验'} mode={'stroke'} onClick={() => refs.form!.clearValidate()}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={state.disabled ? '启用' : '禁用'} onClick={() => state.disabled = !state.disabled} disabled={false}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
        </div>
    )
})
