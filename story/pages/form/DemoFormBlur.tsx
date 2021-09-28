
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
            <DemoRow title={'blur校验'}>
                <PlForm ref={onRef.form} modelValue={formData} disabled={state.disabled}>
                    <PlFormItem label={'普通文本框'} field={'field1'} rules={{required: true, trigger: 'blur'}}>
                        <PlInput v-model={formData.field1}/>
                    </PlFormItem>
                    <PlFormItem label={'普通文本域'} field={'field2'} rules={{required: true, trigger: 'blur'}}>
                        <PlInput v-model={formData.field2} textarea/>
                    </PlFormItem>
                    <PlFormItem label={'数字框'} field={'field3'} rules={{required: true, trigger: 'blur'}}>
                        {{
                            default: <PlNumber v-model={formData.field3} block/>,
                            suffix: <PlTooltip title={'提示'}><PlIcon icon={'el-icon-question'}/></PlTooltip>,
                        }}
                    </PlFormItem>
                    <PlFormItem label={'下拉选项'} field={'field6'} rules={{required: true, trigger: 'blur'}}>
                        <PlSelect v-model={formData.field6}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'级联选择'} field={'field61'} rules={{required: true, trigger: 'blur'}}>
                        <PlCascade
                            v-model={formData.field61}
                            data={treeData}
                            labelField={'name'}
                            keyField={'id'}
                            childrenField={'subs'}
                        />
                    </PlFormItem>
                    <PlFormItem label={'开关按钮'} field={'field10'} rules={{required: true, trigger: 'blur'}}>
                        <PlToggle v-model={formData.field10}/>
                    </PlFormItem>
                    <PlFormItem label={'颜色选择器'} field={'field14'} rules={{required: true, trigger: 'blur'}}>
                        <PlColorPicker v-model={formData.field14}/>
                    </PlFormItem>
                    <PlFormItem label={'时间选择'} field={'field15'} rules={{required: true, trigger: 'blur'}}>
                        <PlTime v-model={formData.field15}/>
                    </PlFormItem>
                    <PlFormItem label={'时间范围选择'} field={['field17', 'field18']} rules={{required: true, trigger: 'blur'}}>
                        <PlTime v-model-start={formData.field17} v-model-end={formData.field18} range/>
                    </PlFormItem>
                    <PlFormItem label={'日期时间选择'} field={'field19'} rules={{required: true, trigger: 'blur'}}>
                        <PlDate v-model={formData.field19} datetime/>
                    </PlFormItem>
                    <PlFormItem label={'日期时间范围选择'} field={['field20', 'field21']} rules={{required: true, trigger: 'blur'}}>
                        <PlDate v-model-start={formData.field20} v-model-end={formData.field21} range datetime/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={'校验'} onClick={saveValidate}/>
                        <PlButton label={'取消校验'} onClick={() => refs.form!.clearValidate()}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={state.disabled ? '启用' : '禁用'} onClick={() => state.disabled = !state.disabled} disabled={false}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
        </div>
    )
})
