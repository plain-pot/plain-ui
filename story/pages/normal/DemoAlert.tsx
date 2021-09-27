import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlAlert from "../../../src/packages/PlAlert";
import {StoryStatus} from "../../story.utils";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <div style={{width: '800px'}}>
                    <PlAlert style={{marginBottom: '10px'}}>
                        Form校验模式的有点就是能够兼容所有的组件，包括原生表单控件以及其他组件库的组件。
                        当校验失败的时候，FormItem底部必定会显示红色的警告信息；
                    </PlAlert>
                    <PlAlert label={'不显示状态图标'} icon={null}/>
                </div>
            </DemoRow>
            <DemoRow title={'状态'}>
                {StoryStatus.map(item => (
                    <PlAlert status={item.status} key={item.status} label={item.label.toUpperCase()} style={{marginBottom: '8px'}}/>
                ))}
            </DemoRow>
            <DemoRow title={'带标题'}>
                <PlAlert message={'默认状态下的提示文本'} label={'默认状态'} status={'primary'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'成功状态下的提示文本'} label={'成功状态'} status={'success'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'警告状态下的提示文本'} label={'警告状态'} status={'warn'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'失败状态下的提示文本'} label={'失败状态'} status={'error'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'提示状态下的提示文本'} label={'提示状态'} status={'info'} style={{marginBottom: '8px'}}/>
            </DemoRow>
            <DemoRow title={'文本对其方式'}>
                <PlAlert label={'居中对齐'} align={'center'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'默认状态下的提示文本'} label={'左对齐'} status={'primary'} align={'left'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'成功状态下的提示文本'} label={'居中对齐'} status={'success'} align={'center'} style={{marginBottom: '8px'}}/>
                <PlAlert message={'警告状态下的提示文本'} label={'右对齐'} status={'warn'} align={'right'} style={{marginBottom: '8px'}}/>
            </DemoRow>
            <DemoRow title={'深色主题'}>
                {StoryStatus.map(item => (
                    <PlAlert theme={'deep'} status={item.status} key={item.status} label={item.label.toUpperCase()} style={{marginBottom: '8px'}}/>
                ))}
                <PlAlert theme="deep" message="默认状态下的提示文本" label="默认状态" status="primary" style={{marginBottom: '8px'}}/>
                <PlAlert theme="deep" message="成功状态下的提示文本" label="成功状态" status="success" style={{marginBottom: '8px'}}/>
                <PlAlert theme="deep" message="警告状态下的提示文本" label="警告状态" status="warn" style={{marginBottom: '8px'}}/>
                <PlAlert theme="deep" message="失败状态下的提示文本" label="失败状态" status="error" style={{marginBottom: '8px'}}/>
                <PlAlert theme="deep" message="提示状态下的提示文本" label="提示状态" status="info" style={{marginBottom: '8px'}}/>
            </DemoRow>
            <DemoRow title={'自定义图标、标题以及内容'}>
                <PlAlert icon={'el-icon-s-opportunity'} status={'success'}>
                    {{
                        default: () => <>
                            <span>自定义标题</span>
                            <PlButton icon={'el-icon-right'} mode={'text'} size={'mini'}/>
                        </>,
                        desc: () => <>
                            <span>自定义内容</span>
                            <PlButton label={'点击了解更多'} mode={'text'} size={'mini'}/>
                        </>
                    }}
                </PlAlert>
            </DemoRow>
        </div>
    )
})
