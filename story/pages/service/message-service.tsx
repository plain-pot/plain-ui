import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton";
import {MessageServiceDirection, useMessage} from "../../../src/packages/useMessage";
import $$message from "../../../src/packages/$$message";
import {designComponent} from "plain-design-composition";
import {reactive} from "vue";

const showMessageWithoutContext = () => {
    $$message('没有上下文的消息服务')
}

export default designComponent({
    setup() {

        let count = 0;
        const $message = useMessage()

        const state = reactive({
            text: '自定义编辑文本'
        })

        const showCustom = () => {
            const option = $message({
                status: 'lite',
                render: () => (
                    <div>
                        <input style={{marginRight: '10px'}} v-model={state.text}/>
                        <PlButton label="close" mode="text" onClick={() => option.close()}/>
                    </div>
                )
            })
        }

        return () => (
            <div>
                <DemoRow title={'基本用法'}>
                    <PlButton label={'显示基本消息'} onClick={() => $message('hello world' + count++)}/>
                </DemoRow>
                <DemoRow title={'没有上下文的消息服务'}>
                    <PlButton label={'没有上下文的消息服务'} onClick={showMessageWithoutContext}/>
                </DemoRow>
                <DemoRow title={'提示类型'}>
                    <PlButton onClick={() => $message.primary('提示信息！')} label="primary" status="primary"/>
                    <PlButton onClick={() => $message.success('提示信息！')} label="success" status="success"/>
                    <PlButton onClick={() => $message.warn('提示信息！')} label="warn" status="warn"/>
                    <PlButton onClick={() => $message.error('提示信息！')} label="error" status="error"/>
                    <PlButton onClick={() => $message.info('提示信息！')} label="help" status="info"/>
                    <PlButton onClick={() => $message.dark('提示信息！')} label="dark" style={{backgroundColor: '#333', border: 'none'}}/>
                    <PlButton onClick={() => $message.lite('提示信息！')} label="lite" style={{backgroundColor: 'white', border: 'solid 1px #ccc', color: '#333'}}/>
                </DemoRow>
                <DemoRow title={'位置'}>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.start, vertical: MessageServiceDirection.start})} label="左上"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.center, vertical: MessageServiceDirection.start})} label="中上"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.end, vertical: MessageServiceDirection.start})} label="右上"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.start, vertical: MessageServiceDirection.center})} label="左中"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.center, vertical: MessageServiceDirection.center})} label="中中"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.end, vertical: MessageServiceDirection.center})} label="右中"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.start, vertical: MessageServiceDirection.end})} label="左下"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.center, vertical: MessageServiceDirection.end})} label="中下"/>
                    <PlButton onClick={() => $message('提示信息！', {horizontal: MessageServiceDirection.end, vertical: MessageServiceDirection.end})} label="右下"/>
                </DemoRow>
                <DemoRow title={'自定义关闭'}>
                    <PlButton onClick={() => $message('提示信息！', {time: 1000, onClose: () => console.log('close')})} label="一秒后自动关闭"/>
                    <PlButton onClick={() => $message('提示信息！', {time: null})} label="不自动关闭"/>
                    <PlButton onClick={() => $message('提示信息！', {onClose: () => console.log('done')})} label="监听结束事件"/>
                    <PlButton onClick={() => $message('提示信息！', {onClick: () => console.log('click')})} label="监听点击事件"/>
                </DemoRow>
                <DemoRow title={'自定义内容'}>
                    <PlButton onClick={showCustom} label="show"/>
                    {state.text}
                </DemoRow>
            </div>
        )
    },
})
