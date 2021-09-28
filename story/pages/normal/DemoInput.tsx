import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlInput} from "../../../src/packages/PlInput";
import {DemoLine} from "../../components/DemoLine";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {delay} from "plain-utils/utils/delay";
import {StoryStatus} from "../../story.utils";
import $$message from "../../../src/packages/$$message";
import PlDropdown from "../../../src/packages/PlDropdown";
import PlIcon from "../../../src/packages/PlIcon";
import PlDropdownMenu from "../../../src/packages/PlDropdownMenu";
import PlDropdownOption from "../../../src/packages/PlDropdownOption";
import PlInputGroup from "../../../src/packages/PlInputGroup";
import PlSelect from "../../../src/packages/PlSelect";
import PlSelectOption from "../../../src/packages/PlSelectOption";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const state = reactive({
        val: {
            2: '一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，'
        } as any,
        passwordVisible: true,
        show: {
            prepend: true,
            append: true,
        },
        dropdownValue: 'http',
        groupValue: {
            acceptType: 'weixin',
            acceptAccount: 'immediate',
            amount: 100,
        },
    })

    const asyncHandler = async (e: any) => {
        $$message('async task start')
        await delay(3000)
        if (Math.random() > 0.5) {
            $$message.error('async task error')
            throw new Error('异步任务出错')
        } else {
            console.log(e)
            $$message.success('async task end')
        }
    }

    return () => {
        return (
            <div>
                <DemoRow title={'基本用法'}>
                    <PlInput v-model={state.val[0]}/>
                    <PlInput v-model={state.val[0]}/>
                    {state.val[0]}
                </DemoRow>
                <DemoRow title={'前后图标'}>
                    <DemoLine>
                        <PlCheckbox label={'是否禁用/只读'} v-model={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'前置图标（禁用）'}>
                        <PlInput prefixIcon={'el-icon-search'} onClickPrefixIcon={() => $$message('prefix')} disabled={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'后置图标（只读）'}>
                        <PlInput suffixIcon={'el-icon-search'} onClickSuffixIcon={() => $$message('suffix')} readonly={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'前后置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 suffixIcon={'el-icon-search'}
                                 onClickPrefixIcon={() => $$message('prefix')}
                                 onClickSuffixIcon={() => $$message('suffix')}
                                 disabled={state.val.flag1}
                        />
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'enter 按键事件节流'}>
                    <PlInput placeholder={'1000ms'} onEnter={() => $$message(String(Date.now()))} throttleEnter/>
                    <PlInput placeholder={'500ms'} onEnter={() => $$message(String(Date.now()))} throttleEnter={500}/>
                </DemoRow>

                <DemoRow title={'自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)'}>
                    <PlInput placeholder={'异步任务'} asyncHandler={asyncHandler} suffixIcon={'el-icon-view'} clearIcon/>
                </DemoRow>

                <DemoRow title={'禁用'}>
                    <PlCheckbox label={'是否禁用'} v-model={state.val.flag2}/>
                    <PlInput disabled={state.val.flag2}/>
                    <PlInput disabled={state.val.flag2} suffixIcon={'el-icon-search'}/>
                    <PlInput disabled={state.val.flag2} textarea style={{verticalAlign: 'bottom'}}/>
                </DemoRow>

                <DemoRow title={'状态'}>
                    <DemoLine title={'input'}>
                        {StoryStatus.map(item => <PlInput status={item.status} key={item.status}/>)}
                    </DemoLine>
                    <DemoLine title={'textarea'}>
                        {StoryStatus.map(item => <PlInput status={item.status} key={item.status} textarea/>)}
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'清除图标'}>
                    <DemoLine title={'基本用法'}>
                        <PlInput clearIcon onClickClearIcon={() => $$message('on click clear')}/>
                    </DemoLine>
                    <DemoLine title={'自定义清除逻辑'}>
                        <PlInput clearIcon onClickClearIcon={() => $$message('on click clear')} clearHandler={() => $$message.success('自定义处理清除逻辑')}/>
                    </DemoLine>
                    <DemoLine title={'带前置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 clearIcon
                                 onClickClearIcon={() => $$message('on click clear')}
                                 onClickPrefixIcon={() => $$message('prefix')}
                        />
                    </DemoLine>
                    <DemoLine title={'带后置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 suffixIcon={'el-icon-search'}
                                 clearIcon
                                 onClickClearIcon={() => $$message('on click clear')}
                                 onClickPrefixIcon={() => $$message('prefix')}
                                 onClickSuffixIcon={() => $$message('suffix')}
                        />
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'加载状态'}>
                    <DemoLine title={'loading'}>
                        <PlInput clearIcon suffixIcon={'el-icon-full-screen'} loading v-model={state.val[0]}/>
                    </DemoLine>
                    <DemoLine title={'input'}>
                        <PlInput clearIcon suffixIcon={'el-icon-full-screen'} v-model={state.val[0]}/>
                    </DemoLine>
                    <span>{state.val[0]}</span>
                </DemoRow>

                <DemoRow title={'块级元素'}>
                    <PlInput block style={{marginBottom: '12px'}}/>
                    <PlInput block textarea/>
                </DemoRow>

                <DemoRow title="输入框组">
                    <div>
                        <PlCheckbox label={'show prepend'} v-model={state.show.prepend}/>
                        <PlCheckbox label={'show append'} v-model={state.show.append}/>
                    </div>
                    <PlInput style={{margin: '8px 0'}} v-slots={(() => {
                        const slots = {} as any
                        if (!!state.show.prepend) {
                            slots.prepend = () => <>
                                <div style={{width: '75px', textAlign: 'left'}}>
                                    <PlDropdown width={null as any}>
                                        {{
                                            default: () => <div>
                                                {!!state.dropdownValue && <span>{state.dropdownValue}://</span>}
                                                <PlIcon icon={'el-icon-arrow-down'}/>
                                            </div>,
                                            popper: () => <PlDropdownMenu>
                                                {['http', 'https', 'ftp', 'ssh'].map(item => <PlDropdownOption label={item} key={item} onClick={() => state.dropdownValue = item}/>)}
                                            </PlDropdownMenu>
                                        }}
                                    </PlDropdown>
                                </div>
                            </>
                        }
                        if (!!state.show.append) {
                            slots.append = () => <div>append content</div>
                        }
                        return slots
                    })()}/>
                </DemoRow>

                <DemoRow title="输入框组">
                    <PlInputGroup>
                        <PlSelect v-model={state.groupValue.acceptType} inputProps={{width: '100px'}}>
                            <PlSelectOption label="微信" val="weixin"/>
                            <PlSelectOption label="支付宝" val="alipay"/>
                            <PlSelectOption label="银联" val="yinlian"/>
                        </PlSelect>
                        <PlInput fillGroup v-model={state.groupValue.amount} style={{flex: '1'}}/>
                        <PlSelect inputProps={{width: '100px'}} modelValue={"immediate"} v-model={state.groupValue.acceptAccount}>
                            <PlSelectOption label="立即转账" val="immediate"/>
                            <PlSelectOption label="定时转账" val="onTime"/>
                        </PlSelect>
                        <PlButton label="确定"/>
                    </PlInputGroup>
                    输入框组右边的内容
                    <div style={{marginTop: '16px'}}>
                        <PlInputGroup block>
                            <PlSelect v-model={state.groupValue.acceptType} inputProps={{width: '100px'}}>
                                <PlSelectOption label="微信" val="weixin"/>
                                <PlSelectOption label="支付宝" val="alipay"/>
                                <PlSelectOption label="银联" val="yinlian"/>
                            </PlSelect>
                            <PlInput fillGroup v-model={state.groupValue.amount} style={{flex: '1'}}/>
                            <PlSelect inputProps={{width: '100px'}} modelValue={"immediate"} v-model={state.groupValue.acceptAccount}>
                                <PlSelectOption label="立即转账" val="immediate"/>
                                <PlSelectOption label="定时转账" val="onTime"/>
                            </PlSelect>
                            <PlButton label="确定"/>
                        </PlInputGroup>
                    </div>
                </DemoRow>

                <DemoRow title={'设置宽度'}>
                    <DemoLine title={'300'}><PlInput width={300}/></DemoLine>
                    <DemoLine title={'300px'}><PlInput width={'300px'}/></DemoLine>
                </DemoRow>

                <DemoRow title={'自定义内容'}>
                    <PlInput suffixIcon={'el-icon-search'}>
                        <span>自定义内容</span>
                    </PlInput>
                </DemoRow>

                <DemoRow title={'大小'}>
                    <PlInput size={'large'}/>
                    <PlInput size={'normal'}/>
                    <PlInput size={'mini'}/>
                </DemoRow>

                <DemoRow title={'形状'}>
                    <PlInput shape={'fillet'}/>
                    <PlInput shape={'round'}/>
                    <PlInput shape={'square'}/>
                </DemoRow>

                <DemoRow title={'文本域输入框'}>
                    <PlInput textarea/>
                </DemoRow>

                <DemoRow title={'文本域输入框：自适应高度'}>
                    <DemoLine title={'基本用法'}>
                        <PlInput textarea autoHeight width={300} v-model={state.val[2]}/>
                    </DemoLine>
                    <DemoLine title={'去掉最大高度'}>
                        <PlInput textarea autoHeight width={300} v-model={state.val[2]} maxHeight={null}/>
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'密码输入框'}>
                    <PlInput suffixIcon={state.passwordVisible ? 'el-icon-view-not-s' : 'el-icon-view'}
                             onClickSuffixIcon={() => state.passwordVisible = !state.passwordVisible}
                             nativeAttrs={{type: state.passwordVisible ? 'text' : 'password'}}
                    />
                </DemoRow>

                <DemoRow title={'禁用以及只读'}>
                    <PlCheckbox label={'是否禁用/只读'} v-model={state.val.flag3}/>
                    <PlInput readonly={state.val.flag3}/>
                    <PlInput disabled={state.val.flag3}/>
                    <input type="text" readonly={state.val.flag3}/>
                </DemoRow>
            </div>
        )
    }
})
