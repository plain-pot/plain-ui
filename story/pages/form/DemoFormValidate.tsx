
import {designPage, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import {PlRadio} from "../../../src/packages/PlRadio";
import {delay} from "plain-utils/utils/delay";
import PlToggle from "../../../src/packages/PlToggle";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import $$message from "../../../src/packages/$$message";
import $$notice from "../../../src/packages/$$notice";
import {tFormRuleItem} from "../../../src/packages/PlForm/form.validate";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        form: PlForm
    })

    const state = reactive({
        formData: {} as any,
        formRules: {
            field2: {required: true, trigger: 'blur'},
            field3: {required: true, min: 3, max: 5, trigger: 'change', message: '3到5个字符'},
        },
        associateFields: {
            field5: ['field5_1'],
            field20: 'field21',
            field21: 'field20',
        },
        disabled: undefined as undefined | boolean,
        config: {} as any,
    })

    const {formData} = state

    const levelData = [
        {levelName: '一级', code: '1'},
        {levelName: '二级', code: '2'},
        {levelName: '三级', code: '3'},
    ]

    function dynamicRequired() {
        if (!formData.field5 || formData.field5.length < 3) {
            if (!formData.field5_1) {
                return '当复选框选项少于3个时，field5_1必填'
            }
        }
    }

    async function customValidator(value: any, row: any, rule: tFormRuleItem) {
        console.log({
            rule, value, row
        })
        await delay(Math.random() * 500 + 500)
        if (!row.field8) {
            return '请先选择[父属性]'
        }
        if (row.field8 === '1' && row.field9 !== 'N') {
            return '[父属性]为一级的时候只能选择否'
        }
    }

    async function saveValidate() {
        await refs.form!.validate()
        $$message.success('校验通过')
    }

    async function asyncSaveValidate() {
        try {
            await refs.form!.validate({autoLoading: false})
            $$message.success('校验通过')
        } catch (e) {
            $$message.error('请检查填写是否正确')
        }
    }

    async function customHandleError() {
        try {
            await refs.form!.validate({autoAlert: false})
            $$message.success('校验通过')
        } catch (e) {
            // this.$refs.form.methods.showError(e)
            $$notice.error(e.message)
        }
    }

    return () => (
        <div>
            <DemoRow>
                <PlForm ref={onRef.form}
                        modelValue={formData}
                        rules={state.formRules}
                        associateFields={state.associateFields}
                        disabled={state.disabled}
                        column={state.config.column}
                        centerWhenSingleColumn={state.config.centerWhenSingleColumn}
                        verticalLabel={state.config.verticalLabel}
                >
                    <PlFormItem label="纵向文本">
                        <PlCheckbox label="纵向文本" v-model={state.config.verticalLabel}/>
                    </PlFormItem>
                    <PlFormItem label="单列居中">
                        <PlCheckbox label="单列居中" v-model={state.config.centerWhenSingleColumn}/>
                    </PlFormItem>
                    <PlFormItem label="列数">
                        <PlRadioGroup v-model={state.config.column} itemWidth="20%">
                            <PlRadio label="单列" val={1}/>
                            <PlRadio label="2列" val={2}/>
                            <PlRadio label="3列" val={3}/>
                            <PlRadio label="4列" val={4}/>
                            <span>[{state.config.column}]</span>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label={'必填校验'} field={'field1'} required>
                        <PlInput v-model={formData.field1}/>
                    </PlFormItem>
                    <PlFormItem label={'多字段校验'} field={['field20', 'field21']} required rules={[
                        {field: 'field20', min: 3, message: '第一个输入框最少3个字符'},
                        {field: 'field21', min: 5, message: '第二个输入框最少5个字符'},
                    ]}>
                        <PlInput v-model={formData.field20}/>
                        &nbsp; 至 &nbsp;
                        <PlInput v-model={formData.field21}/>
                    </PlFormItem>
                    <PlFormItem label={'必填校验(失去焦点)'} field={'field2'}>
                        <PlNumber v-model={formData.field2}/>
                    </PlFormItem>
                    <PlFormItem label={'字符串长度校验 3-5'} field={'field3'}>
                        <PlInput v-model={formData.field3}/>
                    </PlFormItem>
                    <PlFormItem label={'form-item 设置校验规则'} field={'field4'} rules={{required: true, trigger: 'blur'}}>
                        <PlInput v-model={formData.field4}/>
                    </PlFormItem>
                    <PlFormItem label={'数组, 2-3 个选项'} field={'field5'} rules={{type: 'array', min: 2, max: 3, message: '2到3个选项'}} required>
                        <PlCheckboxGroup v-model={formData.field5} itemWidth={'50%'}>
                            <PlCheckbox label="全选" checkboxForAll/>
                            <PlCheckbox label="大客户" val="large"/>
                            <PlCheckbox label="潜在客户" val="potential"/>
                            <PlCheckbox label="长久客户" val="long"/>
                            <PlCheckbox label="赢单客户" val="order"/>
                        </PlCheckboxGroup>
                    </PlFormItem>
                    <PlFormItem label={'当复选框选项少于3个必填'} field={'field5_1'} rules={{required: dynamicRequired}}>
                        <PlInput v-model={formData.field5_1}/>
                    </PlFormItem>
                    <PlFormItem label={'选项校验：确定值'} field={'field6'} rules={[
                        {required: true},
                        {type: 'enum', message: '只能选择二级', enum: ['2']},
                    ]}>
                        <PlSelect v-model={formData.field6}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'选项校验：数组'} field={'field7'} rules={{required: true}}>
                        <PlSelect v-model={formData.field7} multiple>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'父属性'}>
                        <PlSelect v-model={formData.field8}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'自定义(异步2s)校验'} field={'field9'} rules={{required: customValidator}}>
                        <PlRadioGroup v-model={formData.field9} itemWidth={'33%'}>
                            <PlRadio label={'是'} val={'Y'}/>
                            <PlRadio label={'否'} val={'N'}/>
                            <PlRadio label={'未知'} val={'NO'}/>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label={'开启智能加速'} field={'field10'} rules={{message: '当前无法开启只能加速', trigger: 'blur', type: 'enum', enum: [false]}}>
                        <PlToggle v-model={formData.field10}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButtonGroup>
                            <PlButton label={'校验'} onClick={saveValidate}/>
                            <PlButton label={'取消校验'} mode={'stroke'} onClick={() => refs.form?.clearValidate()}/>
                        </PlButtonGroup>
                    </PlFormItem>
                    <PlFormItem label={'校验，不开启遮罩，自动loading按钮'}>
                        <PlButtonGroup vertical>
                            <PlButton label={'校验，不开启遮罩，自动loading按钮'} asyncHandler={asyncSaveValidate}/>
                            <PlButton label={'校验，自定义处理错误信息'} onClick={customHandleError}/>
                        </PlButtonGroup>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={state.disabled ? '启用' : '禁用'} onClick={() => state.disabled = !state.disabled} disabled={false}/>
                    </PlFormItem>

                </PlForm>
            </DemoRow>
        </div>
    )
})
