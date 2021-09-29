import {designComponent, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton";
import {Modes, StoryShapes, StorySizes, StoryStatus} from "../../story.utils";
import {delay} from "plain-utils/utils/delay";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup";
import {$$message} from "../../../src/packages/$$message";

export default designComponent({
    setup() {
        const state = reactive({
            show: true,
            loadingFlag: true,
        })

        const handler = {
            asyncHandler: async () => {
                $$message('async task start')
                await delay(3000)
                if (Math.random() > 0.5) {
                    $$message.error('async task error')
                    throw new Error('异步任务出错')
                } else {
                    $$message.success('async task end')
                }
            },
        }

        return {
            render: () => (
                <div>
                    <DemoRow title={"基本用法"}>
                        {!!state.show && <>
                            <PlButton label={"按钮"} onClick={() => $$message('click')}/>
                            <span>普通文本</span>
                        </>}
                        <button onClick={() => state.show = !state.show}>show button:{state.show}</button>
                    </DemoRow>
                    <DemoRow title={'状态'}>
                        {StoryStatus.map(item => <PlButton status={item.status} key={item.status} label={item.label} onClick={() => $$message[item.status](item.label)}/>)}
                    </DemoRow>
                    <DemoRow title={'模式'}>
                        {Modes.map(mode => (
                            <div key={mode} class={'demo-line'}>
                                {StoryStatus.map(item => <PlButton mode={mode} status={item.status} key={item.status} label={item.label}/>)}
                            </div>
                        ))}
                    </DemoRow>
                    <DemoRow title={'形状'}>
                        {StoryShapes.map(item => <PlButton key={item.shape} shape={item.shape} label={item.label}/>)}
                    </DemoRow>
                    <DemoRow title={'大小'}>
                        {StorySizes.map(item => <PlButton key={item.size} size={item.size} label={item.label}/>)}
                    </DemoRow>

                    <DemoRow title={'图标按钮'}>
                        <PlButton icon="el-icon-search" label="搜索"/>
                        <PlButton icon="el-icon-s-tools" label="搜索" shape="round"/>
                        <PlButton icon="el-icon-search" shape="round"/>
                        <PlButton icon="el-icon-search"/>
                        <PlButton icon="el-icon-search" mode="stroke"/>
                        <PlButton icon="el-icon-search" mode="stroke" shape="round"/>
                        <PlButton icon="el-icon-search" mode="text"/>
                    </DemoRow>

                    <DemoRow title={'块级按钮'}>
                        <PlButton label={'按钮'} block/>
                    </DemoRow>

                    <DemoRow title={'禁用按钮'}>
                        <PlButton label="按钮" mode="fill" disabled icon="el-icon-search"/>
                        <PlButton label="按钮" mode="stroke" disabled/>
                        <PlButton label="按钮" mode="text" disabled/>
                    </DemoRow>

                    <DemoRow title={'加载状态'}>
                        <PlButton label="搜索" loading={state.loadingFlag} width="90"/>
                        <PlButton icon="el-icon-search" label="搜索" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" label="搜索" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="stroke" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="stroke" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="text" loading={state.loadingFlag}/>
                    </DemoRow>

                    <DemoRow title={'click节流'}>
                        <PlButton label="1000ms" onClick={() => $$message(String(Date.now()))} throttleClick/>
                        <PlButton label="500ms" onClick={() => $$message(String(Date.now()))} throttleClick={500}/>
                    </DemoRow>

                    <DemoRow title={'自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)'}>
                        <PlButton label="异步任务" asyncHandler={handler.asyncHandler}/>
                    </DemoRow>

                    <DemoRow title={'按钮组（基本用法）'}>
                        <PlButtonGroup>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                    </DemoRow>
                    <DemoRow title={'按钮组（模式）'}>
                        <PlButtonGroup mode={'fill'}>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                        <PlButtonGroup mode={'stroke'}>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                        <PlButtonGroup mode={'text'}>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                    </DemoRow>

                    <DemoRow title={'按钮组（继承属性）'}>
                        <DemoRow title={'大小'}>
                            <PlButtonGroup size={'large'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                            <PlButtonGroup size={'normal'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                            <PlButtonGroup size={'mini'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                        </DemoRow>
                        <DemoRow title={'形状'}>
                            <PlButtonGroup shape={'fillet'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                            <PlButtonGroup shape={'round'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                            <PlButtonGroup shape={'square'}>
                                <PlButton label={'奶油'}/>
                                <PlButton label={'蛋糕'}/>
                                <PlButton label={'大福'}/>
                            </PlButtonGroup>
                        </DemoRow>
                    </DemoRow>

                    <DemoRow title={'按钮组方向'}>
                        <PlButtonGroup vertical>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                        <PlButtonGroup vertical mode={'stroke'}>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                        <PlButtonGroup vertical mode={'text'}>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                    </DemoRow>

                    <DemoRow title={'按钮组禁用与只读'}>
                        <PlButtonGroup disabled>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                        <PlButtonGroup readonly>
                            <PlButton label={'奶油'}/>
                            <PlButton label={'蛋糕'}/>
                            <PlButton label={'大福'}/>
                        </PlButtonGroup>
                    </DemoRow>
                </div>
            )
        }
    },
})
