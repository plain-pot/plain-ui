import {designPage} from "plain-ui-composition";
import {reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {PlStepGroup} from "../../../src/packages/PlStepGroup";
import {PlStep} from "../../../src/packages/PlStep";
import $$message from "../../../src/packages/$$message";
import './DemoStep.scss'
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import PlArrowStepGroup from "../../../src/packages/PlArrowStepGroup";
import PlArrowStep from "../../../src/packages/PlArrowStep";
import PlIcon from "../../../src/packages/PlIcon";

export default designPage(() => {

    const state = reactive({
        val: {
            1: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            2: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            3: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            4: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            5: {
                index: 2,
            },
            6: {
                index: 1,
            },
        },
        showFlag: true,
        val1: {
            0: 1,
            1: 2,
            3: 'step1',
        },
    })

    return () => {
        return (
            <div class={'demo-step'}>
                <DemoRow title={'基本用法'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[1].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[1].mini}/>
                        <PlCheckbox label={'纵向步骤条'} v-model={state.val[1].vertical}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[1].titleAlignBottom}/>
                        <PlCheckbox label={'显示[创建二维码]'} v-model={state.showFlag}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[1].index}
                            vertical={state.val[1].vertical}
                            mini={state.val[1].mini}
                            titleAlignBottom={state.val[1].titleAlignBottom}
                            currentStatus={state.val[1].index === 5 ? 'finish' : undefined}
                        >
                            <PlStep title="获取token" message="调用接口，获取token" onClick={() => $$message('获取token')}/>
                            <PlStep title="上传logo" message="使用token上传logo图片" onClick={() => $$message('上传logo')}/>
                            <PlStep title="创建卡券" message="调用接口创建卡券信息" onClick={() => $$message('创建卡券')}/>
                            {state.showFlag && <PlStep title="创建二维码" message="调用接口创建二维码" onClick={() => $$message('创建二维码')}/>}
                            <PlStep title="显示二维码" message="在应用中显示二维码" onClick={() => $$message('显示二维码')}/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'步骤图标'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[2].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[2].mini}/>
                        <PlCheckbox label={'纵向步骤条'} v-model={state.val[2].vertical}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[2].titleAlignBottom}/>
                        <PlCheckbox label={'显示[创建二维码]'} v-model={state.showFlag}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[2].index}
                            vertical={state.val[2].vertical}
                            mini={state.val[2].mini}
                            titleAlignBottom={state.val[2].titleAlignBottom}
                            currentStatus={state.val[2].index === 5 ? 'finish' : undefined}
                        >
                            <PlStep icon="el-icon-s-promotion" title="获取token" message="调用接口，获取token" onClick={() => $$message('获取token')}/>
                            <PlStep icon="el-icon-upload" title="上传logo" message="使用token上传logo图片" onClick={() => $$message('上传logo')}/>
                            <PlStep icon="el-icon-s-ticket" title="创建卡券" message="调用接口创建卡券信息" onClick={() => $$message('创建卡券')}/>
                            {state.showFlag && <PlStep icon="el-icon-document" title="创建二维码" message="调用接口创建二维码" onClick={() => $$message('创建二维码')}/>}
                            <PlStep icon="el-icon-camera-solid" title="显示二维码" message="在应用中显示二维码" onClick={() => $$message('显示二维码')}/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'小圆点'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[3].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[3].mini}/>
                        <PlCheckbox label={'纵向步骤条'} v-model={state.val[3].vertical}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[3].titleAlignBottom}/>
                        <PlCheckbox label={'显示[创建二维码]'} v-model={state.showFlag}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[3].index}
                            vertical={state.val[3].vertical}
                            mini={state.val[3].mini}
                            titleAlignBottom={state.val[3].titleAlignBottom}
                            currentStatus={state.val[3].index === 5 ? 'finish' : undefined}
                            dotIcon
                        >
                            <PlStep title="获取token" message="调用接口，获取token" onClick={() => $$message('获取token')}/>
                            <PlStep title="上传logo" message="使用token上传logo图片" onClick={() => $$message('上传logo')}/>
                            <PlStep title="创建卡券" message="调用接口创建卡券信息" onClick={() => $$message('创建卡券')}/>
                            {state.showFlag && <PlStep title="创建二维码" message="调用接口创建二维码" onClick={() => $$message('创建二维码')}/>}
                            <PlStep title="显示二维码" message="在应用中显示二维码" onClick={() => $$message('显示二维码')}/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'步骤状态'}>
                    <DemoLine>
                        <PlStepGroup dotIcon>
                            <PlStep title="Finish" message="This step is finish" status="finish"/>
                            <PlStep title="Process" message="This step is processing..." status="process"/>
                            <PlStep title="error" message="This step is error!" status="error"/>
                            <PlStep title="Wait" message="This step is not start." status="wait"/>
                        </PlStepGroup>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup>
                            <PlStep title="Finish" message="This step is finish" status="finish" icon="el-icon-success"/>
                            <PlStep title="Process" message="This step is processing..." status="process" icon="el-icon-s-tools"/>
                            <PlStep title="error" message="This step is error!" status="error" icon="el-icon-error"/>
                            <PlStep title="Wait" message="This step is not start." status="wait" icon="el-icon-info"/>
                        </PlStepGroup>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup vertical>
                            <PlStep title="Finish" message="This step is finish" status="finish"/>
                            <PlStep title="Process" message="This step is processing..." status="process"/>
                            <PlStep title="error" message="This step is error!" status="error"/>
                            <PlStep title="Wait" message="This step is not start." status="wait"/>
                        </PlStepGroup>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup dotIcon vertical>
                            <PlStep title="Finish" message="This step is finish" status="finish"/>
                            <PlStep title="Process" message="This step is processing..." status="process"/>
                            <PlStep title="error" message="This step is error!" status="error"/>
                            <PlStep title="Wait" message="This step is not start." status="wait"/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'通过绑定val切换步骤'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlButtonGroup>
                            <PlButton label={'step1'} onClick={() => state.val1[3] = 'step1'} active={state.val1[3] === 'step1'}/>
                            <PlButton label={'step2'} onClick={() => state.val1[3] = 'step2'} active={state.val1[3] === 'step2'}/>
                            <PlButton label={'step3'} onClick={() => state.val1[3] = 'step3'} active={state.val1[3] === 'step3'}/>
                            <PlButton label={'step4'} onClick={() => state.val1[3] = 'step4'} active={state.val1[3] === 'step4'}/>
                            <PlButton label={'step5'} onClick={() => state.val1[3] = 'step5'} active={state.val1[3] === 'step5'}/>
                        </PlButtonGroup>
                    </DemoLine>
                    <PlStepGroup current={state.val1[3]} currentStatus={state.val1[3] === 'step5' ? 'finish' : undefined}>
                        <PlStep title="获取token" message="调用接口，获取token" val={'step1'}/>
                        <PlStep title="上传logo" message="使用token上传logo图片" val={'step2'}/>
                        <PlStep title="创建卡券" message="调用接口创建卡券信息" val={'step3'}/>
                        <PlStep title="创建二维码" message="调用接口创建二维码" val={'step4'}/>
                        <PlStep title="显示二维码" message="在应用中显示二维码" val={'step5'}/>
                    </PlStepGroup>
                    <div style={{
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'dashed 1px #e1e1e1'
                    }}>
                        <h1 style={{display: state.val1[3] === 'step1' ? '' : 'none'}}>Step 1</h1>
                        <h1 style={{display: state.val1[3] === 'step2' ? '' : 'none'}}>Step 2</h1>
                        <h1 style={{display: state.val1[3] === 'step3' ? '' : 'none'}}>Step 3</h1>
                        <h1 style={{display: state.val1[3] === 'step4' ? '' : 'none'}}>Step 4</h1>
                        <h1 style={{display: state.val1[3] === 'step5' ? '' : 'none'}}>Step 5</h1>
                    </div>
                </DemoRow>
                <DemoRow title={'自定义标题以及文本内容'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[4].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[4].mini}/>
                        <PlCheckbox label={'纵向步骤条'} v-model={state.val[4].vertical}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[4].titleAlignBottom}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[4].index}
                            vertical={state.val[4].vertical}
                            mini={state.val[4].mini}
                            titleAlignBottom={state.val[4].titleAlignBottom}
                            currentStatus={state.val[4].index === 5 ? 'finish' : undefined}
                        >
                            <PlStep>
                                {{
                                    title: () => (<span>获取token</span>),
                                    content: () => (<span>1、调用接口，获取token</span>)
                                }}
                            </PlStep>
                            <PlStep>
                                {{
                                    title: () => (<span>上传logo</span>),
                                    content: () => (<span>2、使用token上传logo图片</span>)
                                }}
                            </PlStep>
                            <PlStep>
                                {{
                                    title: () => (<span>创建卡券</span>),
                                    content: () => (<span>3、调用接口创建卡券信息</span>)
                                }}
                            </PlStep>
                            <PlStep>
                                {{
                                    title: () => (<span>创建二维码</span>),
                                    content: () => (<span>4、调用接口创建二维码</span>)
                                }}
                            </PlStep>
                            <PlStep>
                                {{
                                    title: () => (<span>显示二维码</span>),
                                    content: () => (<span>5、在应用中显示二维码</span>)
                                }}
                            </PlStep>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'箭头步骤条'}>
                    <DemoLine title={'当前步骤条索引'}>
                        <PlNumber v-model={state.val[5].index}/>
                    </DemoLine>
                    <PlArrowStepGroup current={state.val[5].index}>
                        <PlArrowStep title={'获取token'} onClick={() => $$message('获取token')}/>
                        <PlArrowStep title={'上传logo'} onClick={() => $$message('上传logo')}/>
                        <PlArrowStep title={'创建卡券'} onClick={() => $$message('创建卡券')}/>
                        <PlArrowStep title={'创建二维码'} onClick={() => $$message('创建二维码')}/>
                        <PlArrowStep title={'显示二维码'} onClick={() => $$message('显示二维码')}/>
                    </PlArrowStepGroup>
                </DemoRow>
                <DemoRow title={'箭头步骤条：状态'}>
                    <PlArrowStepGroup>
                        <PlArrowStep title="Finish" status="finish"/>
                        <PlArrowStep title="Process" status="process"/>
                        <PlArrowStep title="error" status="error"/>
                        <PlArrowStep title="Wait" status="wait"/>
                    </PlArrowStepGroup>
                </DemoRow>
                <DemoRow title={'箭头步骤条：自定义内容'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[6].index}/>
                    </DemoLine>
                    <PlArrowStepGroup current={state.val[6].index} class={'custom-content-slot'}>
                        <PlArrowStep hideIndex>
                            <PlIcon icon={'el-icon-s-promotion'}/>
                            <span>获取token</span>
                        </PlArrowStep>
                        <PlArrowStep hideIndex>
                            <PlIcon icon={'el-icon-upload'}/>
                            <span>上传logo</span>
                        </PlArrowStep>
                        <PlArrowStep hideIndex>
                            <PlIcon icon={'el-icon-s-ticket'}/>
                            <span>创建卡券</span>
                        </PlArrowStep>
                        <PlArrowStep hideIndex>
                            <PlIcon icon={'el-icon-document'}/>
                            <span>创建二维码</span>
                        </PlArrowStep>
                        <PlArrowStep hideIndex>
                            <PlIcon icon={'el-icon-camera-solid'}/>
                            <span>显示二维码</span>
                        </PlArrowStep>
                    </PlArrowStepGroup>
                </DemoRow>
            </div>
        )
    }
})
