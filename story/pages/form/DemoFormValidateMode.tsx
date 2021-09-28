
import {designPage, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlAlert from "../../../src/packages/PlAlert";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import PlButton from "../../../src/packages/PlButton";
import $$message from "../../../src/packages/$$message";

export default designPage(() => {

    const {formData1, formData2} = reactive({
        formData1: {} as any,
        formData2: {} as any,
    })

    const {refs, onRef} = useRefs({form1: PlForm, form2: PlForm})

    const levelData = [
        {levelName: '一级', code: '1'},
        {levelName: '二级', code: '2'},
        {levelName: '三级', code: '3'},
    ]

    async function validateFormMode() {
        await refs.form1!.validate()
        $$message.success('校验通过')
    }

    async function validateTableMode() {
        await refs.form2!.validate()
        $$message.success('校验通过')
    }

    return () => (
        <div>
            <PlAlert title={'edit组件'}>
                以下简称 edit组件 为 “使用了useEdit组合函数进行控制的组件”，原生控件以及其他组件库的组件可以通过useEdit 函数封装变成edit组件；
            </PlAlert>
            <br/>
            <br/>

            <DemoRow title={'默认模式:form'}>
                <PlForm modelValue={formData1} ref={onRef.form1}>
                    <PlFormItem label={'标准文本框：必填'} field={'input'} required>
                        <PlInput v-model={formData1.input}/>
                    </PlFormItem>
                    <PlFormItem label={'标准下拉框：必填'} field={'select'} required>
                        <PlSelect v-model={formData1.select}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'自定义组件：必填'} field={'custom'} required>
                        <input type="text" v-model={formData1.custom}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={'校验'} onClick={validateFormMode}/>
                    </PlFormItem>
                </PlForm>
                <PlAlert label="validateMode = form">
                    这种模式为表单模式，通过深度 watch model绑定的表单对象，来判断字段变化，然后自动触发 change 校验，这种模式的优点是，
                    能够兼容所有的双向绑定表单组件，当然包括原生的表单控件。缺点是需要深度 watch表单对象，在表格中这种方式性能比较低。所以在表格中不采取这种方式
                    触发change校验；
                </PlAlert>
            </DemoRow>

            <DemoRow title={'表格模式：table'}>
                <PlForm modelValue={formData2} ref={onRef.form2} validateMode={'table'}>
                    <PlFormItem label={'标准文本框：必填'} field={'input'} required>
                        <PlInput v-model={formData2.input}/>
                    </PlFormItem>
                    <PlFormItem label={'标准下拉框：必填'} field={'select'} required>
                        <PlSelect v-model={formData2.select}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'自定义组件：必填'} field={'custom'} required>
                        <input type="text" v-model={formData2.custom}/>
                    </PlFormItem>
                    <PlFormItem>
                        <PlButton label={'校验'} onClick={validateTableMode}/>
                    </PlFormItem>
                </PlForm>
                <PlAlert title="validateMode = table">
                    这种模式为表格模式，通过监听form-item中，edit组件的change事件，来触发change校验。这种模式的优点是，
                    能够精确地知道那个 form-item 的组件发生值绑定变化从而触发校验，缺点是，不兼容edit组件以外的其他组件，包括其他组件库的组件以及原生控件。
                </PlAlert>
                <br/>
                <PlAlert status="info">
                    还有一个变化是，如果一个form-item的field是一个数组，就是校验多个字段的意思，当其中一个字段的值变化了，那么form模式下只会触发这个变化的字段
                    的相关校验，而table模式下，会触发form-item上field中所有字段的校验；
                </PlAlert>
                <br/>
                <PlAlert status="warn">
                    无论何种模式下，blur校验只能是edit组件有效。
                </PlAlert>
                <br/>
                <PlAlert status="success">
                    当调用 form 组件的 validate函数时，会触发所有校验，这个与是否为edit组件无关。
                </PlAlert>
            </DemoRow>
        </div>
    )
})
