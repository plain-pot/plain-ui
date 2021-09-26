import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton";
import {NoticeServiceDirection, useNotice} from "../../../src/packages/useNotice";
import {StyleStatus} from "../../../src/use/useStyle";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup";
import {$$message} from "../../../src/packages/$$message";
import {PlLoading} from "../../../src/packages/PlLoading";
import {PlIcon} from "../../../src/packages/PlIcon";
import $$notice from "../../../src/packages/$$notice";

const showNoticeWithoutContext = () => {
    $$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！')
}

export default designPage(() => {

    const $notice = useNotice()

    const custom = {
        foot: () => {
            const handler = {
                delete: () => {
                    $$message.error('删除');
                    notice.close()
                },
                reply: () => {
                    $$message.error('回复');
                    notice.close()
                }
            }
            const notice = $notice({
                title: '自定义底部内容',
                message: '你有一封未读消息！',
                time: null,
                renderFoot: () => <>
                    <PlButton label="删除" mode="stroke" size="mini" status="error" onClick={handler.delete}/>
                    <PlButton label="回复" size="mini" status="primary" onClick={handler.reply}/>
                </>
            })
        },
        render: () => {
            $notice({
                time: null,
                renderHead: () => (
                    <div>
                        <PlLoading style={{marginRight: '16px'}} type="beta"/>
                        <span>正在加载中...</span>
                    </div>
                ),
                renderContent: () => (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <PlIcon icon="el-icon-upload" style={{fontSize: '36px'}} status="primary"/>
                        <span>当前正在导入数据，请稍后等待！</span>
                    </div>
                ),
                renderFoot: () => <>
                    <PlButton label="取消导入" mode="stroke" size="mini" status="error"/>
                </>
            })
        }
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'基本用法'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！')}/>
            </DemoRow>
            <DemoRow title={'无上下文服务(全局调用)'}>
                <PlButton onClick={showNoticeWithoutContext} label={'无上下文服务(全局调用)'}/>
            </DemoRow>
            <DemoRow title={'状态'}>
                <PlButton onClick={() => $notice.primary('提示信息！')} label="primary" status="primary"/>
                <PlButton onClick={() => $notice.success('提示信息！')} label="success" status="success"/>
                <PlButton onClick={() => $notice.warn('提示信息！')} label="warn" status="warn"/>
                <PlButton onClick={() => $notice.error('提示信息！')} label="error" status="error"/>
                <PlButton onClick={() => $notice.info('提示信息！')} label="help" status="info"/>
                <PlButton onClick={() => $notice('提示信息！', {status: null})} label="无状态" status="info"/>
            </DemoRow>
            <DemoRow title={'自定义图标'}>
                <PlButton label={'基本用法'} onClick={() => $notice('打开开发者工具预览示例！', {icon: 'el-icon-tools', status: StyleStatus.success})}/>
            </DemoRow>
            <DemoRow title={'位置'}>
                <PlButtonGroup>
                    <PlButton label={'右上角'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '右上角', horizontal: NoticeServiceDirection.end, vertical: NoticeServiceDirection.start})}/>
                    <PlButton label={'右下角'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '右下角', horizontal: NoticeServiceDirection.end, vertical: NoticeServiceDirection.end})}/>
                    <PlButton label={'左上角'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '左上角', horizontal: NoticeServiceDirection.start, vertical: NoticeServiceDirection.start})}/>
                    <PlButton label={'左下角'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '左下角', horizontal: NoticeServiceDirection.start, vertical: NoticeServiceDirection.end})}/>
                </PlButtonGroup>
            </DemoRow>
            <DemoRow title={'停留时间'}>
                <PlButton label={'默认3s'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '确认'})}/>
                <PlButton label={'停留1s'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '确认', time: 1000})}/>
                <PlButton label={'取消自动关闭'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {title: '确认', time: null})}/>
            </DemoRow>
            <DemoRow title={'自定义内容'}>
                <PlButton label={'自定义底部内容'} onClick={custom.foot}/>
                <PlButton label={'自定义内容'} onClick={custom.render}/>
            </DemoRow>
            <DemoRow title={'去掉关闭按钮'}>
                <PlButton label={'基本用法'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {noClose: true})}/>
            </DemoRow>
            <DemoRow title={'点击事件以及关闭事件'}>
                <PlButton label={'点击事件以及关闭事件'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！', {onClose: () => $$message('close'), onClick: () => $$message('click')})}/>
            </DemoRow>
        </div>
    )
})
