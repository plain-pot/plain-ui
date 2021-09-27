import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlDialog} from "../../../src/packages/PlDialog";
// @ts-ignore
import data from '../data/data-1.json'
import './DemoDialog.scss'
import {PlInput} from "../../../src/packages/PlInput";
import {delay} from "plain-utils/utils/delay";
import $$message from "../../../src/packages/$$message";
import PlButton from "../../../src/packages/PlButton";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";

export default designPage(() => {

    const state = reactive({
        val: {
            14: false,
            // 14: true,
        } as any,
    })

    const str = JSON.stringify(data)

    const beforeClose = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let flag = Math.random() > 0.5
                $$message({
                    message: flag ? 'close success' : 'close reject',
                    status: flag ? 'primary' : 'error'
                })
                resolve(flag)
            }, 1000)
        })
    }

    const openLoading = async () => {
        state.val[18] = true
        await delay(2000)
        state.val[18] = false
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'open dialog'} onClick={() => state.val[0] = !state.val[0]}/>
                <PlDialog v-model={state.val[0]}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'大小'}>
                <PlButton label={'宽高'} onClick={() => state.val[1] = true}/>
                <PlDialog v-model={state.val[1]} width={400} height={'500px'}>{str}</PlDialog>
                <PlButton label={'最小宽高'} onClick={() => state.val[2] = true}/>
                <PlDialog v-model={state.val[2]} minWidth={300} minHeight={'200px'}>hello world</PlDialog>
                <PlButton label={'最大宽高'} onClick={() => state.val[3] = true}/>
                <PlDialog v-model={state.val[3]} maxWidth={400} maxHeight={'500px'}>{str}</PlDialog>
            </DemoRow>
            <DemoRow title={'通过设置 wrapperPadding 调整 对话框偏移位置'}>
                <PlButton label={'wrapperPadding'} onClick={() => state.val[4] = true}/>
                <PlDialog v-model={state.val[4]} wrapperPadding={'0 0'}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'去掉内容内边距'}>
                <PlButton label={'contentPadding'} onClick={() => state.val[41] = true}/>
                <PlDialog v-model={state.val[41]} contentPadding={false}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'标题'}>
                <PlButton label={'title'} onClick={() => state.val[5] = !state.val[5]}/>
                <PlDialog v-model={state.val[5]} v-slots={{
                    head: () => <span>自定义标题</span>,
                    default: () => 'hello world',
                }}/>
            </DemoRow>
            <DemoRow title={'全屏'}>
                <PlButton label={'fullscreen'} onClick={() => state.val[6] = !state.val[6]}/>
                <PlDialog v-model={state.val[6]} fullscreen>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'无遮罩'}>
                <PlButton label={'mask'} onClick={() => state.val[7] = !state.val[7]}/>
                <PlDialog v-model={state.val[7]} mask={false}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'自定义样式class'}>
                <PlButton label={'dialogClass'} onClick={() => state.val[8] = !state.val[8]}/>
                <PlDialog v-model={state.val[8]} dialogClass="demo-dialog">
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'禁用点击遮罩的时候触发cancel动作'}>
                <PlButton label={'cancelOnClickMask'} onClick={() => state.val[9] = !state.val[9]}/>
                <PlDialog v-model={state.val[9]} cancelOnClickMask={false}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'去掉关闭按钮'}>
                <PlButton label={'showClose'} onClick={() => state.val[11] = !state.val[11]}/>
                <PlDialog v-model={state.val[11]} showClose={false}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'关闭前校验'}>
                <PlButton label={'beforeClose'} onClick={() => state.val[12] = !state.val[12]}/>
                <PlDialog v-model={state.val[12]} beforeClose={beforeClose}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'垂直居中'}>
                <PlButton label={'center'} onClick={() => state.val[13] = !state.val[13]}/>
                <PlDialog v-model={state.val[13]} center>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'destroyOnClose'}>
                <PlButton label={'关闭时销毁'} onClick={() => state.val[14] = !state.val[14]}/>
                <PlDialog v-model={state.val[14]}><PlInput block/></PlDialog>
                <PlButton label={'关闭时不销毁'} onClick={() => state.val[15] = !state.val[15]}/>
                <PlDialog v-model={state.val[15]} destroyOnClose={false}><PlInput block/></PlDialog>
            </DemoRow>
            <DemoRow title={'确认以及取消按钮'}>
                <PlButton label={'确认以及取消按钮'} onClick={() => state.val[16] = !state.val[16]}/>
                <PlDialog v-model={state.val[16]}
                          confirmButton
                          cancelButton
                          onConfirm={() => $$message('confirm')}
                          onCancel={() => $$message('cancel')}
                          confirmButtonText={'保存'}
                          cancelButtonText={'不保存'}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'加载状态'}>
                <PlButton label={'loading'} onClick={() => state.val[17] = !state.val[17]}/>
                <PlDialog v-model={state.val[17]} loading={state.val[18]}>
                    <PlButtonGroup>
                        <PlButton label="open loading" onClick={openLoading}/>
                        <PlButton onClick={() => state.val[16] = true} label="open previous dialog"/>
                    </PlButtonGroup>
                </PlDialog>
            </DemoRow>
            <DemoRow title={'隐藏标题'}>
                <PlButton label={'showHead'} onClick={() => state.val[19] = !state.val[19]}/>
                <PlDialog v-model={state.val[19]} showHead={false}>
                    hello world
                </PlDialog>
            </DemoRow>
            <DemoRow title={'弹框位置'}>
                <PlButton label={'LEFT'} onClick={() => state.val[20] = true}/>
                <PlDialog v-model={state.val[20]} wrapperPadding={false} horizontal={'start'} fullHeight transition={'pl-transition-dialog-left'} confirmButton cancelButton>
                    Hello world
                </PlDialog>
                <PlButton label={'RIGHT'} onClick={() => state.val[21] = true}/>
                <PlDialog v-model={state.val[21]} wrapperPadding={false} horizontal={'end'} fullHeight transition={'pl-transition-dialog-right'}>
                    Hello world
                </PlDialog>
                <PlButton label={'TOP'} onClick={() => state.val[22] = true}/>
                <PlDialog v-model={state.val[22]} wrapperPadding={false} vertical={'start'} fullWidth transition={'pl-transition-dialog-top'} confirmButton cancelButton>
                    Hello world
                </PlDialog>
                <PlButton label={'BOTTOM'} onClick={() => state.val[23] = true}/>
                <PlDialog v-model={state.val[23]} wrapperPadding={false} vertical={'end'} fullWidth transition={'pl-transition-dialog-bottom'} confirmButton cancelButton>
                    Hello world
                </PlDialog>
            </DemoRow>
        </div>
    )
})
