import {DemoRow} from "../../components/DemoRow";
import PlButton from "../../../src/packages/PlButton";
import useDialog from "../../../src/packages/useDialog";
import {StoryStatus} from "../../story.utils";
import $$message from "../../../src/packages/$$message";
import {designPage} from "plain-ui-composition";

export default designPage(() => {

    const $dialog = useDialog()

    const deleteConfirm = async () => {
        await $dialog.confirm('确认要删除该文件吗？')
        $$message.success('删除成功！')
    }

    const customDialog = () => {
        $dialog({
            title: '确认提示',
            dialogProps: {
                horizontal: 'end',
                transition: 'pl-transition-dialog-right',
                fullHeight: true,
                wrapperPadding: false,
            },
            render: () => {
                return (
                    <PlButton label={'hello world'}/>
                )
            },
        })
    }

    const multiService = (message = 1) => {
        const option = $dialog({
            render: () => {
                return (
                    <div>
                        <div>
                            {`第${message}个实例`}
                        </div>
                        <PlButton label="close" onClick={() => option.close()} style={{marginRight: '8px'}}/>
                        <PlButton label="open another dialog" onClick={() => multiService(message + 1)}/>
                    </div>
                )
            },
        })
    }

    let inputValue: string | undefined = '默认文本'

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'基本用法'} onClick={() => $dialog('操作成功')}/>
            </DemoRow>
            <DemoRow title={'提示状态'}>
                {StoryStatus.map(item => <PlButton
                    status={item.status} key={item.status} label={item.label}
                    onClick={() => $dialog[item.status]('操作进行中')}
                />)}
            </DemoRow>
            <DemoRow title={'确认对话框'}>
                <PlButton label={'删除'} onClick={deleteConfirm}/>
            </DemoRow>
            <DemoRow title={'去掉状态图标'}>
                <PlButton label={'去掉状态图标'} onClick={() => $dialog('hello world', {status: null})}/>
            </DemoRow>
            <DemoRow title={'dialog参数，以及自定义内容'}>
                <PlButton label={'自定义参数以及内容'} onClick={customDialog}/>
            </DemoRow>

            <DemoRow title={'输入对话框'}>
                <PlButton label={'input'} onClick={() => $dialog({
                    editType: 'input',
                    editValue: inputValue,
                    onConfirm: val => {
                        inputValue = val;
                        $$message(String(val))
                    },
                    confirmButton: true,
                    cancelButton: true,
                })}/>
                <PlButton label={'input readonly'} onClick={() => $dialog({
                    editType: 'input',
                    editValue: inputValue,
                    editReadonly: true,
                    onConfirm: val => {
                        inputValue = val;
                        $$message(String(val))
                    },
                    confirmButton: true,
                    cancelButton: true,
                })}/>
                <PlButton label={'textarea'} onClick={() => $dialog({
                    editType: 'textarea',
                    editValue: inputValue,
                    onConfirm: val => {
                        inputValue = val;
                        $$message(String(val))
                    },
                    confirmButton: true,
                    cancelButton: true,
                })}/>
                <PlButton label={'textarea'} onClick={() => $dialog({
                    editType: 'textarea',
                    editValue: inputValue,
                    editReadonly: true,
                    onConfirm: val => {
                        inputValue = val;
                        $$message(String(val))
                    },
                    confirmButton: true,
                    cancelButton: true,
                })}/>
                <PlButton label={'number'} onClick={() => $dialog({
                    editType: 'number',
                    editValue: 100,
                    onConfirm: val => {
                        $$message(String(val))
                    },
                    confirmButton: true,
                    cancelButton: true,
                })}/>
            </DemoRow>

            <DemoRow title={'多实例'}>
                <PlButton label={'open dialog'} onClick={() => multiService()}/>
            </DemoRow>
        </div>
    )
})
