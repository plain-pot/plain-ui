import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlCarousel from "../../../src/packages/PlCarousel";
import PlCarouselItem from "../../../src/packages/PlCarouselItem";
import {DemoLine} from "../../components/DemoLine";

export default designPage(() => {

    const publicItemStyles = {
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlCarousel>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
            <DemoRow title={'两个元素，三个元素'}>
                <PlCarousel style={{width: '400px', display: 'inline-flex'}}>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                </PlCarousel>
                <PlCarousel style={{width: '400px', display: 'inline-flex'}}>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
            <DemoRow title={'禁用前后按钮'}>
                <PlCarousel disabledOperator>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
            <DemoRow title={'指示器'}>
                <DemoLine title={'禁用指示器'}>
                    <PlCarousel disabledIndicator style={{width: '400px'}}>
                        <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                    </PlCarousel>
                </DemoLine>
                <DemoLine title={'鼠标悬浮激活指示器'}>
                    <PlCarousel style={{width: '400px'}} indicatorTrigger={'hover'}>
                        <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                    </PlCarousel>
                </DemoLine>
                <DemoLine title={'自定义指示器'}>
                    <PlCarousel style={{width: '400px'}} indicatorTrigger={'hover'} v-slots={{
                        default: () => <>
                            <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                            <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                            <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                            <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                        </>,
                        indicator: ({active, index}) => (
                            <div key={index} style={{marginRight: '8px', height: '5px', width: '5px', backgroundColor: `rgba(255,255,255,${active ? '1' : '0.5'})`}}/>
                        )
                    }}/>
                </DemoLine>
            </DemoRow>
            <DemoRow title={'cover覆盖内容'}>
                <PlCarousel v-slots={{
                    default: () => <>
                        <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                    </>,
                    cover: () => (
                        <div style={{pointerEvents: 'none', textAlign: 'center', padding: '20px', color: 'white', boxSizing: 'border-box'}}>
                            this is cover content
                        </div>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'自动播放'}>
                <DemoLine title={'禁用自动播放'}>
                    <PlCarousel autoplay={0} style={{width: '400px'}}>
                        <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                    </PlCarousel>
                </DemoLine>
                <DemoLine title={'时间间隔为6s'}>
                    <PlCarousel autoplay={6000} style={{width: '400px'}}>
                        <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                        <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                    </PlCarousel>
                </DemoLine>
            </DemoRow>

            <DemoRow title={'纵向切换'}>
                <PlCarousel vertical>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
            <DemoRow title={'卡片形式切换'}>
                <PlCarousel card autoplay={0} style={{width: '500px'}}>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
        </div>
    )
})
