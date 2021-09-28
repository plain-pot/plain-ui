import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import PlProgressBar from "../../../src/packages/PlProgressBar";
import PlProgressCircle from "../../../src/packages/PlProgressCircle";
import PlIcon from "../../../src/packages/PlIcon";
import PlSlider from "../../../src/packages/PlSlider";
import {reactive} from "plain-design-composition";
import PlProgressMini from "../../../src/packages/PlProgressMini";

export default designPage(() => {

    const state = reactive({
        val: {
            2: 10,
            3: 73,
        } as any
    })

    return () => (
        <div>
            <DemoRow title={'条形进度条'}>
                <DemoLine title={'基本用法'}>
                    <PlProgressBar modelValue={65}/>
                </DemoLine>
                <DemoLine title={'宽高'}>
                    <PlProgressBar modelValue={65} width={'100px'} height={'3px'}/>
                </DemoLine>
                <DemoLine title={'颜色'}>
                    <PlProgressBar modelValue={65} innerColor={'blueviolet'} outerColor={'#ddd'}/>
                </DemoLine>
                <DemoLine title={'状态'}>
                    <PlProgressBar modelValue={65} status={'success'}/>
                    <PlProgressBar modelValue={65} status={'error'}/>
                </DemoLine>
                <DemoLine title={'状态颜色'}>
                    <PlProgressBar modelValue={65} status={'success'} successColor={'green'}/>
                    <PlProgressBar modelValue={65} status={'error'} errorColor={'red'}/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'条形进度条：内联文字'}>
                <DemoLine title={'基本用法'}>
                    <PlProgressBar modelValue={65} inlineText/>
                </DemoLine>
                <DemoLine title={'宽高（高度不可修改）'}>
                    <PlProgressBar modelValue={65} width={'100px'} inlineText/>
                </DemoLine>
                <DemoLine title={'颜色'}>
                    <PlProgressBar modelValue={65} innerColor={'blueviolet'} outerColor={'#ddd'} inlineText/>
                </DemoLine>
                <DemoLine title={'状态'}>
                    <PlProgressBar modelValue={65} status={'success'} inlineText/>
                    <PlProgressBar modelValue={65} status={'error'} inlineText/>
                </DemoLine>
                <DemoLine title={'状态颜色'}>
                    <PlProgressBar modelValue={65} status={'success'} successColor={'green'} inlineText/>
                    <PlProgressBar modelValue={65} status={'error'} errorColor={'red'} inlineText/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'环形进度条'}>
                <DemoLine title={'基本用法'}>
                    <PlProgressCircle modelValue={65}/>
                </DemoLine>
                <DemoLine title={'大小'}>
                    <PlProgressCircle modelValue={65} size={80}/>
                </DemoLine>
                <DemoLine title={'线宽'}>
                    <PlProgressCircle modelValue={65} lineSize={3}/>
                </DemoLine>
                <DemoLine title={'起始角度（并且逆时针）'}>
                    <PlProgressCircle modelValue={65} startAngle={180} antiClockwise/>
                </DemoLine>
                <DemoLine title={'颜色'}>
                    <PlProgressCircle modelValue={65} innerColor={'blueviolet'} outerColor={'#ddd'}/>
                </DemoLine>
                <DemoLine title={'状态'}>
                    <PlProgressCircle modelValue={65} status={'success'}/>
                    <PlProgressCircle modelValue={65} status={'error'}/>
                </DemoLine>
                <DemoLine title={'状态颜色'}>
                    <PlProgressCircle modelValue={65} status={'success'} successColor={'green'}/>
                    <PlProgressCircle modelValue={65} status={'error'} errorColor={'red'}/>
                </DemoLine>
                <DemoLine title={'加载状态'}>
                    <PlProgressCircle loading>
                        <PlIcon icon={'el-icon-upload'} status={'primary'}/>
                    </PlProgressCircle>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'迷你进度条'}>
                <DemoLine title={'进度值'}>
                    <PlSlider v-model={state.val[2]}/>
                </DemoLine>
                <DemoLine title={'基本用法'}>
                    <PlProgressMini modelValue={state.val[2]}/>
                </DemoLine>
                <DemoLine title={'大小'}>
                    <PlProgressMini modelValue={state.val[2]} size={80}/>
                </DemoLine>
                <DemoLine title={'颜色'}>
                    <PlProgressMini modelValue={state.val[2]} innerColor={'blueviolet'} outerColor={'#ddd'}/>
                </DemoLine>
                <DemoLine title={'状态'}>
                    <PlProgressMini modelValue={state.val[2]} status={'success'}/>
                    <PlProgressMini modelValue={state.val[2]} status={'error'}/>
                </DemoLine>
                <DemoLine title={'状态颜色'}>
                    <PlProgressMini modelValue={state.val[2]} status={'success'} successColor={'green'}/>
                    <PlProgressMini modelValue={state.val[2]} status={'error'} errorColor={'red'}/>
                </DemoLine>
                <DemoLine title={'圆形mini进度条'}>
                    <PlProgressMini modelValue={state.val[2]} round/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'数据绑定'}>
                <DemoLine title={'数据绑定值'}>
                    <PlSlider v-model={state.val[3]}/>
                    {state.val[3]}
                </DemoLine>
                <DemoLine>
                    <PlProgressBar modelValue={state.val[3]}/>
                </DemoLine>
                <DemoLine>
                    <PlProgressBar modelValue={state.val[3]} inlineText/>
                </DemoLine>
                <DemoLine>
                    <PlProgressCircle modelValue={state.val[3]}/>
                </DemoLine>
                <DemoLine>
                    <PlProgressMini modelValue={state.val[3]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
