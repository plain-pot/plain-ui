import {designComponent, useRefs} from "plain-ui-composition";
import React, {ReactElement} from "react";
import FlipMove from "react-flip-move";
import './list.scss'
import {PropType} from "plain-ui-composition"

export const PlList = designComponent({
    props: {
        tag: {type: String, default: 'div'},
        easing: {type: String, default: 'cubic-bezier(0.23, 1, 0.32, 1)'},
        duration: {type: [String, Number], default: '300ms'},
        animation: {type: String as PropType<FlipMove.AnimationProp>},
        enterAnimation: {type: String as PropType<FlipMove.AnimationProp>},
        leaveAnimation: {type: String as PropType<FlipMove.AnimationProp>},
        onStart: {type: Function as PropType<(childElement: ReactElement<any>, domNode: HTMLElement) => void>},
        onFinish: {type: Function as PropType<(childElement: ReactElement<any>, domNode: HTMLElement) => void>},
        onStartAll: {type: Function as PropType<(childElements: Array<ReactElement<any>>, domNodes: Array<HTMLElement>) => void>},
        onFinishAll: {type: Function as PropType<(childElements: Array<ReactElement<any>>, domNodes: Array<HTMLElement>) => void>},
        disableAllAnimations: {type: Boolean, default: false},
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const defaultFlipAnimation = {
            enter: {
                from: {
                    transform: 'translateY(30px)',
                    opacity: 0.15,
                },
                to: {
                    transform: '',
                },
            },
            leave: {
                from: {
                    transform: '',
                },
                to: {
                    transform: 'translateY(-30px)',
                    opacity: 0,
                },
            },
        }

        return {
            refer: {
                refs,
            },
            render: () => {
                const Tag = props.tag as any
                return (
                    <Tag class="pl-list" ref={onRef.el}>
                        <FlipMove
                            typeName={null}
                            easing={props.easing}
                            duration={props.duration}
                            enterAnimation={props.enterAnimation || defaultFlipAnimation.enter}
                            leaveAnimation={props.leaveAnimation || defaultFlipAnimation.leave}
                            onStart={props.onStart}
                            onFinish={props.onFinish}
                            onStartAll={props.onStartAll}
                            onFinishAll={props.onFinishAll}
                            disableAllAnimations={props.disableAllAnimations}
                            {...{children: slots.default()} as any}
                        />
                    </Tag>
                )
            }
        }
    },
})

export default PlList
