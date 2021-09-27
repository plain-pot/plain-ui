import {designPage} from "plain-ui-composition";
import PlCard from "../../../src/packages/PlCard";
import PlButton from "../../../src/packages/PlButton";
import {DemoRow} from "../../components/DemoRow";
import PlIcon from "../../../src/packages/PlIcon";

// todo card demo wait for tooltip
export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlCard title={'卡片标题'}>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
            </DemoRow>
            <DemoRow title={'小型卡片'}>
                <PlCard title={'卡片标题'} mini>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
            </DemoRow>
            <DemoRow title={'卡片阴影'}>
                <PlCard title={'shadow=normal'} shadow={'normal'}>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            一直显示阴影
                        </>
                    }}
                </PlCard>
                <PlCard title={'shadow=hover'} shadow={'hover'}>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            鼠标炫富显示阴影
                        </>
                    }}
                </PlCard>
            </DemoRow>
            <DemoRow title={'标题描述'}>
                <PlCard title={'卡片标题'}>
                    {{
                        desc: () => '标题下面的描述',
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
                <PlCard>
                    {{
                        title: () => <>
                            <span>自定义标题</span>
                            <PlIcon icon={'el-icon-info'}/>
                        </>,
                        desc: () => <>
                            <span>自定义标题描述</span>
                            <PlIcon icon={'el-icon-d-arrow-right'}/>
                        </>,
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
            </DemoRow>
            <DemoRow title={'取消内边距'}>
                <PlCard title={'卡片标题'} noPadding>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
            </DemoRow>
            <DemoRow title={'海报图'}>
                <PlCard title={'圣诞之夜'} shadow={'normal'}>
                    {{
                        operator: () => <PlButton label={'更多'} mode={'text'}/>,
                        default: () => <>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                            <div>卡片内容</div>
                        </>
                    }}
                </PlCard>
            </DemoRow>
        </div>
    )
})
