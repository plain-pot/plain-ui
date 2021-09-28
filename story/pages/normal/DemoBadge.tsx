import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlBadge from "../../../src/packages/PlBadge";
import PlButton from "../../../src/packages/PlButton";
import {StoryStatus} from "../../story.utils";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlBadge data={12}>
                    <PlButton label={'消息'}/>
                </PlBadge>
            </DemoRow>
            <DemoRow title={'颜色'}>
                {StoryStatus.map(item => (
                    <PlBadge data={12} key={item.status} status={item.status}>
                        <PlButton label={'消息'}/>
                    </PlBadge>
                ))}
            </DemoRow>
            <DemoRow title={'位置'}>
                <PlBadge data={12} bottom={false} start={true}>
                    <PlButton label={'消息'}/>
                </PlBadge>
                <PlBadge data={12} bottom={false} start={false}>
                    <PlButton label={'消息'}/>
                </PlBadge>
                <PlBadge data={12} bottom={true} start={true}>
                    <PlButton label={'消息'}/>
                </PlBadge>
                <PlBadge data={12} bottom={true} start={false}>
                    <PlButton label={'消息'}/>
                </PlBadge>
            </DemoRow>
            <DemoRow title={'仅显示小红点'}>
                <PlBadge data={12} dot>
                    <PlButton label={'消息'}/>
                </PlBadge>
            </DemoRow>
            <DemoRow title={'最大值'}>
                <PlBadge data={200} max={99}>
                    <PlButton label={'消息'}/>
                </PlBadge>
            </DemoRow>
        </div>
    )
})
