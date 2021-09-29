import {designPage, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import $$notice from "../../../src/packages/$$notice";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        form: PlForm
    })

    const state = reactive({
        formData: {} as any,
        associateFields: {
            address: 'addrDetail',
            addrDetail: 'address',

            parentValue: 'childValue',
        },
    })

    const {formData} = state

    async function execValidate() {
        await refs.form!.validate()
        $$notice.success('校验通过！')
    }

    return () => (
        <div>
            <DemoRow>
                <PlForm ref={onRef.form} modelValue={formData} associateFields={state.associateFields}>
                    <PlFormItem label={'并列字段'} field={['address', 'addrDetail']} rules={[
                        {field: 'address', required: true, message: '省市县必填'},
                        {field: 'addrDetail', required: true, message: '街道门牌号必填'},
                    ]}>
                        <PlInput v-model={formData.address} placeholder={'省市县'}/>
                        <span style={{padding: '0 1em'}}>~</span>
                        <PlInput v-model={formData.addrDetail} placeholder={'街道门牌号'}/>
                    </PlFormItem>
                    <PlFormItem label={'关联字段'} field={'parentValue'}>
                        <PlSelect v-model={formData.parentValue} onChange={() => formData.childValue = null}>
                            <PlSelectOption label="选项一" val="val_1"/>
                            <PlSelectOption label="选项二" val="val_2"/>
                            <PlSelectOption label="选项三" val="val_3"/>
                        </PlSelect>
                    </PlFormItem>
                    {!!formData.parentValue && (
                        <PlFormItem label={'子字段'} field={'childValue'} required>
                            <PlInput v-model={formData.childValue}/>
                        </PlFormItem>
                    )}
                    <PlFormItem>
                        <PlButtonGroup>
                            <PlButton label={'校验'} onClick={execValidate}/>
                            <PlButton label={'取消校验'} mode={'stroke'} onClick={() => refs.form!.clearValidate()}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
        </div>
    )
})
