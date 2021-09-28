
import {computed, designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlInput} from "../../../src/packages/PlInput";
import {PlNumber} from "../../../src/packages/PlNumber";
import PlTooltip from "../../../src/packages/PlTooltip";
import PlIcon from "../../../src/packages/PlIcon";
import {PlRadioGroup} from "../../../src/packages/PlRadioGroup";
import {PlRadio} from "../../../src/packages/PlRadio";
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const state = reactive({
        formData: {} as any,
        formDisabledFields: [] as string[],
        flag: {
            disabled: undefined as undefined | boolean,
            readonly: undefined as undefined | boolean,
        },
    })

    const {formData, flag} = state

    const targetFormDisabledFields = computed(() => {
        return state.formDisabledFields.reduce((ret, item) => {
            ret[item] = true
            return ret
        }, {} as any)
    })

    const levelData = [
        {levelName: '一级', code: '1'},
        {levelName: '二级', code: '2'},
        {levelName: '三级', code: '3'},
    ]


    return () => (
        <div>
            <DemoRow title={'父子disabled以及readonly设置'}>
                <DemoLine>
                    <PlCheckbox v-model={flag.disabled} label={'禁用'}/>
                    <PlCheckbox v-model={flag.readonly} label={'只读'}/>
                </DemoLine>
                <PlForm disabled={flag.disabled} readonly={flag.readonly}>
                    <PlForm disabled={flag.disabled} readonly={flag.readonly}>
                        <PlFormItem label={'客户名称'} field={'name'}>
                            <PlInput v-model={formData.name}/>
                        </PlFormItem>
                        <PlFormItem label={'客户员工数量'} field={'type'}>
                            {{
                                default: ()=><PlNumber v-model={formData.type}/>,
                                suffix: ()=><PlTooltip message="整数"><PlIcon icon={'el-icon-question'}/></PlTooltip>
                            }}
                        </PlFormItem>
                        <PlFormItem label={'客户加入时间'} field={'joinTime'} disabled={false}>
                            <PlInput v-model={formData.joinTime}/>
                            <span>&nbsp;至&nbsp;</span>
                            <PlInput v-model={formData.name}/>
                        </PlFormItem>
                        <PlFormItem label={'是否老客户'} field={'oldFlag'} disabled={false}>
                            <PlRadioGroup v-model={formData.oldFlag} itemWidth={'50%'}>
                                <PlRadio label={'老客户'} val={'Y'} disabled/>
                                <PlRadio label={'非老客户'} val={'N'}/>
                            </PlRadioGroup>
                        </PlFormItem>
                        <PlFormItem label={'客户性质'} field={'properties'}>
                            <PlCheckboxGroup v-model={formData.properties} itemWidth={'50%'}>
                                <PlCheckbox label={'大客户'} val={'large'}/>
                                <PlCheckbox label={'潜在客户'} val={'potential'}/>
                                <PlCheckbox label={'长久客户'} val={'long'}/>
                                <PlCheckbox label={'赢单客户'} val={'order'}/>
                            </PlCheckboxGroup>
                        </PlFormItem>
                        <PlFormItem label={'客户级别'} field={'level'}>
                            <PlSelect v-model={formData.level}>
                                {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                            </PlSelect>
                        </PlFormItem>
                        <PlFormItem label={'备注'} field={'comments'}>
                            <PlInput textarea v-model={formData.comments}/>
                        </PlFormItem>
                        <PlFormItem label={' '}>
                            <PlButton mode={'stroke'} label={'取消'}/>
                            <PlButton label={'提交'}/>
                        </PlFormItem>
                    </PlForm>
                </PlForm>
            </DemoRow>
            <DemoRow title={'通过disabledFields控制禁用'}>
                <PlCheckboxGroup v-model={state.formDisabledFields}>
                    <PlCheckbox checkboxForAll label="全部"/>
                    <PlCheckbox label="客户名称" val="name"/>
                    <PlCheckbox label="客户员工数量" val="type"/>
                    <PlCheckbox label="客户加入时间" val="joinTime"/>
                    <PlCheckbox label="是否老客户" val="oldFlag"/>
                    <PlCheckbox label="客户性质" val="properties"/>
                    <PlCheckbox label="客户级别" val="level"/>
                    <PlCheckbox label="备注" val="comments"/>
                    <PlCheckbox label="禁用操作按钮" val="button"/>
                </PlCheckboxGroup>
                <br/>
                <div>
                    {JSON.stringify(state.formDisabledFields)}
                </div>
                <br/>
                <PlForm disabledFields={targetFormDisabledFields.value}>
                    <PlFormItem label={'客户名称'} field={'name'}>
                        <PlInput v-model={formData.name}/>
                    </PlFormItem>
                    <PlFormItem label={'客户员工数量'} field={'type'}>
                        {{
                            default: ()=><PlNumber v-model={formData.type}/>,
                            suffix: ()=><PlTooltip message="整数"><PlIcon icon={'el-icon-question'}/></PlTooltip>
                        }}
                    </PlFormItem>
                    <PlFormItem label={'客户加入时间'} field={'joinTime'} disabled={false}>
                        <PlInput v-model={formData.joinTime}/>
                        <span>&nbsp;至&nbsp;</span>
                        <PlInput v-model={formData.name}/>
                    </PlFormItem>
                    <PlFormItem label={'是否老客户'} field={'oldFlag'} disabled={false}>
                        <PlRadioGroup v-model={formData.oldFlag} itemWidth={'50%'}>
                            <PlRadio label={'老客户'} val={'Y'} disabled/>
                            <PlRadio label={'非老客户'} val={'N'}/>
                        </PlRadioGroup>
                    </PlFormItem>
                    <PlFormItem label={'客户性质'} field={'properties'}>
                        <PlCheckboxGroup v-model={formData.properties} itemWidth={'50%'}>
                            <PlCheckbox label={'大客户'} val={'large'}/>
                            <PlCheckbox label={'潜在客户'} val={'potential'}/>
                            <PlCheckbox label={'长久客户'} val={'long'}/>
                            <PlCheckbox label={'赢单客户'} val={'order'}/>
                        </PlCheckboxGroup>
                    </PlFormItem>
                    <PlFormItem label={'客户级别'} field={'level'}>
                        <PlSelect v-model={formData.level}>
                            {levelData.map(item => <PlSelectOption label={item.levelName} val={item.code} key={item.code}/>)}
                        </PlSelect>
                    </PlFormItem>
                    <PlFormItem label={'备注'} field={'comments'}>
                        <PlInput textarea v-model={formData.comments}/>
                    </PlFormItem>
                    <PlFormItem label={' '} field="button">
                        <PlButton mode={'stroke'} label={'取消'}/>
                        <PlButton label={'提交'}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
        </div>
    )
})
