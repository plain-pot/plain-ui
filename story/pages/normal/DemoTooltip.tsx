import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlTooltip from "../../../src/packages/PlTooltip";
import PlButton from "../../../src/packages/PlButton";
import {PlInput} from "../../../src/packages/PlInput";

export default designPage(() => {

    const state = reactive({
        tooltipText: '文本长度溢出时tooltip显示文本',
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTooltip tooltip={'tooltip文本'}>
                    <span>普通文本一定要用节点包裹</span>
                </PlTooltip>
                <PlTooltip tooltip={'tooltip文本'}>
                    <PlButton>按钮</PlButton>
                </PlTooltip>
            </DemoRow>
            <DemoRow title={'主题'}>
                <PlTooltip tooltip="Tooltip文本" theme="dark">
                    <span>DARK</span>
                </PlTooltip>
                <PlTooltip tooltip="Tooltip文本" theme="light">
                    <span>LIGHT</span>
                </PlTooltip>
            </DemoRow>
            <DemoRow title="溢出时tooltip显示">
                <PlInput v-model={state.tooltipText}/>
                <PlTooltip tooltip="Tooltip文本" showWidth={100}>
                    {state.tooltipText}
                </PlTooltip>
            </DemoRow>
        </div>
    )
})
