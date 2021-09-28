import {reactive, designPage, useRefs} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlPopper} from "../../../src/packages/PlPopper";
import PlButton from "../../../src/packages/PlButton";
import PlIcon from "../../../src/packages/PlIcon";
import {DemoLine} from "../../components/DemoLine";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import $$message from "../../../src/packages/$$message";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        button: HTMLButtonElement,
    })

    const state = reactive({
        disabledPopper: false,
        val: {
            direction: 'bottom',
            align: 'start',
            transition: 'pl-transition-popper-drop',
            showArrow: false,
        } as any,
    })

    const directions = ['top', 'bottom', 'left', 'right']
    const aligns = ['start', 'center', 'end']
    const animations = [
        'pl-transition-fade',
        'pl-transition-scale',
        'pl-transition-scale-y',
        'pl-transition-popper-drop',
    ]

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlPopper message={'消息文本'} title="标题">
                    <span>默认hover显示</span>
                </PlPopper>
                <PlPopper message={'消息文本'} title="标题">
                    <PlButton mode={'text'}>默认hover显示</PlButton>
                </PlPopper>
                <PlPopper v-slots={{
                    default: () => <><span>自定义内容</span></>,
                    head: () => <>
                        <span>自定义标题</span>
                        <PlIcon icon={'el-icon-info'}/>
                    </>,
                    popper: () => <>
                        <PlPopper message={'消息文本'} placement="right" title="标题">
                            <PlButton mode={'text'}>默认hover显示</PlButton>
                        </PlPopper>
                        <p>popper content 111</p>
                        <p>popper content 222</p>
                    </>
                }}/>
                <PlPopper message={'消息文本'} placement={'bottom'} title="标题">
                    <PlIcon icon={'el-icon-info'}/>
                </PlPopper>
            </DemoRow>

            <DemoRow title={'位置'}>
                {directions.map(direction => (
                    <DemoLine key={direction} title={direction}>
                        <PlButtonGroup>
                            <PlPopper placement={direction} key={`${direction}-1`}>
                                {{
                                    default: () => <PlButton label={direction}/>,
                                    popper: () => (
                                        <div style={{height: '55px'}}>
                                            这里是popper的内容
                                        </div>
                                    )
                                }}
                            </PlPopper>
                            {aligns.map(align => (
                                <PlPopper key={align} placement={`${direction}-${align}`}>
                                    {{
                                        default: () => <PlButton label={`${direction}-${align}`}/>,
                                        popper: () => (
                                            <div style={{height: '55px'}}>
                                                这里是popper的内容
                                            </div>
                                        )
                                    }}
                                </PlPopper>
                            ))}
                        </PlButtonGroup>
                    </DemoLine>
                ))}
            </DemoRow>

            <DemoRow title={'触发动作'}>
                <DemoLine>
                    <PlCheckbox label={'禁用 popper'} v-model={state.disabledPopper}/>
                </DemoLine>
                <PlPopper disabled={state.disabledPopper} trigger={'hover'}>
                    {{
                        default: () => <PlButton label={'hover激活'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper disabled={state.disabledPopper} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'click激活'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper disabled={state.disabledPopper} trigger={'manual'} v-model={state.val[1]}>
                    {{
                        default: () => <PlButton label={'manual激活'} onClick={() => state.val[1] = !state.val[1]}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper disabled={state.disabledPopper} trigger={'focus'}>
                    {{
                        default: () => <PlButton label={'focus激活'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper disabled={state.disabledPopper} trigger={'focus'}>
                    {{
                        default: () => <button>focus激活</button>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'测试组件销毁之后，监听的事件是否已经销毁'}>
                <PlCheckbox v-model={state.val.init} label={'show popper'}/>
                {!!state.val.init && (
                    <PlPopper trigger={'click'} onClickBody={() => $$message('click body')}>
                        {{
                            default: () => <PlButton label={'click激活'}/>,
                            popper: () => (
                                <div style={{height: '55px'}}>
                                    这里是popper的内容
                                </div>
                            )
                        }}
                    </PlPopper>
                )}
            </DemoRow>

            <DemoRow title={'自定义reference'}>
                <button ref={onRef.button}>放在Popper之外的Reference</button>
                <PlPopper trigger={'click'} reference={refs.button as HTMLElement}>
                    {{
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'自动设置popper大小，在方向上与reference大小对其'}>
                <PlPopper placement="top" sizeEqual>
                    {{
                        default: () => <PlButton label={'纵向'} style={{width: '100px', height: '100px'}}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper placement="left" sizeEqual>
                    {{
                        default: () => <PlButton label={'横向'} style={{width: '100px', height: '100px'}}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'动画'}>
                <PlPopper transition={'pl-transition-fade'} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'fade'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper transition={'pl-transition-scale'} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'scale'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper transition={'pl-transition-scale-y'} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'scale-y'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
                <PlPopper transition={'pl-transition-popper-drop'} trigger={'click'} arrow={false} placement={'bottom-start'}>
                    {{
                        default: () => <PlButton label={'popper-drop'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'show与open的区别'}>
                <div>show:{String(state.val.show)}</div>
                <div>open:{String(state.val.open)}</div>
                <PlCheckbox label={'toggle'} v-model={state.val.show}/>

                <PlPopper
                    v-models={[
                        [state.val.show],
                        [state.val.open, 'open']
                    ]}
                    onOpen={() => console.log('open')}
                    onClose={() => console.log('close')}
                    onChange={() => console.log('change')}
                    transition={'pl-transition-scale-y'}
                    trigger={'click'}
                    placement={'bottom-start'}>
                    {{
                        default: () => <PlButton label={'popper-drop'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        )
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'综合测试'}>
                <DemoLine style={{height: '100px'}}>
                    <PlPopper
                        trigger={'manual'}
                        transition={state.val.transition}
                        placement={`${state.val.direction}-${state.val.align}`}
                        arrow={state.val.showArrow}
                        v-model={state.val.showTest}
                    >
                        {{
                            default: () => <PlButton label={'toggle'} onClick={() => state.val.showTest = !state.val.showTest}/>,
                            popper: () => (
                                <div style={{height: '55px'}}>
                                    这里是popper的内容
                                </div>
                            ),
                        }}
                    </PlPopper>
                </DemoLine>
                <DemoLine title={'direction'}>
                    <PlButtonGroup>
                        {directions.map(direction => <PlButton label={direction} key={direction} onClick={() => state.val.direction = direction} active={state.val.direction === direction}/>)}
                    </PlButtonGroup>
                </DemoLine>
                <DemoLine title={'align'}>
                    <PlButtonGroup>
                        {aligns.map(align => <PlButton label={align} key={align} onClick={() => state.val.align = align} active={state.val.align === align}/>)}
                    </PlButtonGroup>
                </DemoLine>
                <DemoLine title={'animation'}>
                    <PlButtonGroup>
                        {animations.map(animation => <PlButton label={animation} key={animation} onClick={() => state.val.transition = animation} active={state.val.transition === animation}/>)}
                    </PlButtonGroup>
                </DemoLine>
                <DemoLine>
                    <PlCheckbox v-model={state.val.showArrow} label={'show arrow'}/>
                </DemoLine>
            </DemoRow>

            <DemoRow title={'设置宽高'}>
                <PlPopper width={150} height={200} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'150:number,200:number'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        ),
                    }}
                </PlPopper>
                <PlPopper width={'150px'} height={'200px'} trigger={'click'}>
                    {{
                        default: () => <PlButton label={'150px:string,200px:string'}/>,
                        popper: () => (
                            <div style={{height: '55px'}}>
                                这里是popper的内容
                            </div>
                        ),
                    }}
                </PlPopper>
            </DemoRow>

            <DemoRow title={'配置内置的滚动条'}>
                <i>只有设置height时才会使用Scroll容器</i>
                <PlPopper
                    noContentPadding
                    height={100}
                    trigger={'click'}>
                    {{
                        default: () => <span>CLICK(无标题)</span>,
                        popper: () => (
                            <ol style={{
                                margin: 0,
                                padding: '0 16px',
                                paddingInlineStart: '28px',
                                paddingInlineEnd: '0',
                            }}>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                            </ol>
                        )
                    }}
                </PlPopper>

                <PlPopper
                    title={'标题'}
                    noContentPadding
                    height={100}
                    trigger={'click'}>
                    {{
                        default: () => <span>CLICK</span>,
                        popper: () => (
                            <ol style={{
                                margin: 0,
                                padding: '0 16px',
                                paddingInlineStart: '28px',
                                paddingInlineEnd: '0',
                            }}>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                                <li>消息内容</li>
                            </ol>
                        )
                    }}
                </PlPopper>
            </DemoRow>
        </div>
    )
})
