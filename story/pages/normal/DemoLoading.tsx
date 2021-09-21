import {designComponent, reactive, ref} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlLoading} from "../../../src/packages/PlLoading";
import {PlLoadingMask} from "../../../src/packages/PlLoadingMask";
import {useLoading} from "../../../src/packages/useLoading";
import {delay} from "plain-utils/utils/delay";
import {LoadingBar} from "../../../src/packages/useLoading/bar";
import $$message from "../../../src/packages/$$message";
import PlCheckbox from "../../../src/packages/PlCheckbox";
import PlButton from "../../../src/packages/PlButton";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";

// console.log(delay, PlainLoading)

export default designComponent({
    setup() {

        const state = reactive({
            flag1: {
                loading: true,
                init: true,
            },
            flag2: {
                loading: true,
                init: true,
            },
            bar: null,
        })

        const $loading = useLoading()

        const testFullLoading = async () => {
            const option = $loading.full({message: '正在加载资源文件...'})
            $$message('三秒钟之后关闭！')
            await delay(3000)
            option.close()
        }

        const bars = ref([] as LoadingBar[])
        const newLoadingBar = () => bars.value.push($loading.bar())

        return () => (
            <div>
                <DemoRow title={"基本用法"}>
                    <PlLoading/>
                </DemoRow>
                <DemoRow title={"类型"}>
                    <PlLoading type={'alpha'}/>
                    <PlLoading type={'beta'}/>
                    <PlLoading type={'gamma'}/>
                    <PlLoading type={'delta'}/>
                    <PlLoading type={'ice'}/>
                </DemoRow>
                <DemoRow title={"字体大小"}>
                    <div>
                        <PlLoading type={'alpha'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'beta'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'gamma'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'delta'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'ice'} style={{fontSize: '24px'}}/>
                    </div>
                </DemoRow>
                <DemoRow title={"状态颜色"}>
                    <PlLoading type={'alpha'} status={'primary'}/>
                    <PlLoading type={'beta'} status={'success'}/>
                    <PlLoading type={'gamma'} status={'warn'}/>
                    <PlLoading type={'delta'} status={'error'}/>
                    <PlLoading type={'ice'} status={'info'}/>
                </DemoRow>
                <DemoRow title={"自定义颜色"}>
                    <div style={{color: 'blueviolet'}}>
                        <PlLoading type={'alpha'}/>
                        <PlLoading type={'beta'}/>
                        <PlLoading type={'gamma'}/>
                        <PlLoading type={'delta'}/>
                        <PlLoading type={'ice'}/>
                    </div>
                </DemoRow>
                <DemoRow title={"组件调用loading-mask"}>
                    <PlCheckbox label={'init'} v-model={state.flag1.init}/>
                    <PlCheckbox label={'open mask'} v-model={state.flag1.loading}/>
                    <span>如果父节点的position不为fixed、relative、absolute，pl-loading-mask会自动将父节点的样式设置为 relative</span>
                    {!!state.flag1.init && (
                        <div style={{height: '300px', width: '300px', backgroundColor: '#f6f6f6'}}>
                            <PlButton label={'this is button'}/>
                            <PlLoadingMask v-model={state.flag1.loading} message={'loading...'}/>
                        </div>
                    )}
                </DemoRow>
                <DemoRow title={'全屏加载遮罩服务'}>
                    <PlButton label={'提交'} onClick={testFullLoading}/>
                </DemoRow>
                <DemoRow title={'加载进度条'}>
                    <PlButton label={'新的进度条'} onClick={newLoadingBar}/>
                    {bars.value.map((item, index) => (
                        <div key={index} style={{marginTop: '16px'}}>
                            <PlButtonGroup size={'mini'} mode={'stroke'}>
                                <PlButton label={'done'} onClick={() => {
                                    item.done()
                                    bars.value.splice(index, 1)
                                }}/>
                                <PlButton label={'fail'} onClick={() => {
                                    item.fail()
                                    bars.value.splice(index, 1)
                                }} status={'error'}/>
                            </PlButtonGroup>
                        </div>
                    ))}
                </DemoRow>
            </div>
        )
    },
})