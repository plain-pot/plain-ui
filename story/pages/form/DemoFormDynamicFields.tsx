import {designPage, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import PlButton from "../../../src/packages/PlButton";
import $$notice from "../../../src/packages/$$notice";

export default designPage(() => {

    const {formData} = reactive({
        formData: {
            email: '111@aa.com',
            addressList: [
                {addr: ''}
            ],
        },
    })
    const {refs, onRef} = useRefs({form: PlForm})

    async function save() {
        await refs.form!.validate()
        $$notice.success('校验通过')
    }

    return () => (
        <div>
            <DemoRow title={'动态增减表单项'}>
                <PlForm labelWidth={'120px'} ref={onRef.form} modelValue={formData}>
                    <PlFormItem label={'收件箱'} field={'email'} rules={{
                        type: 'email',
                        // pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '请输入正确的邮箱',
                        required: true,
                        trigger: 'blur',
                    }}>
                        <PlInput v-model={formData.email}/>
                    </PlFormItem>
                    {formData.addressList.map((item, index) => (
                        <PlFormItem label={`收件人地址${index + 1}`} field={`addressList.${index}.addr`} key={index} rules={{required: true, trigger: 'blur'}}>
                            <PlInput v-model={item.addr}/>
                            <PlButton icon={'el-icon-minus'} style={{marginLeft: '1em'}} mode={'stroke'} size={'mini'} onClick={() => {formData.addressList.splice(index, 1)}}/>
                        </PlFormItem>
                    ))}
                    <PlFormItem>
                        <PlButton label={'保存'} onClick={save}/>
                        <PlButton label={'新增收件地址'} onClick={() => formData.addressList.push({addr: ''})}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
        </div>
    )
})
