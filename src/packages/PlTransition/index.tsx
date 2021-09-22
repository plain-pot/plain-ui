import {designClassComponent, designComponent, onBeforeMount, PropType, useReference} from "plain-ui-composition";

import {CSSTransition, SwitchTransition} from "react-transition-group";
import {createCounter} from "plain-ui-composition"
import {findDOMNode} from "react-dom";

const PlSwitchTransition = designComponent({
    props: {
        mode: {type: String as PropType<'out-in' | 'in-out'>, default: 'out-in'},
        name: {type: String, required: true},
    },
    emits: {
        onEnter: () => true,
        onExit: () => true,
        onEntered: () => true,
        onExited: () => true,
    },
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const count = createCounter('pl_transition')

        const state = {
            key: count(),
            prevKey: '' as any,
            prevType: null as any,
        }

        return () => {
            const children = slots.default() as any
            if (!children) {
                state.key = count()
            } else {
                const {key, type} = children
                if (key !== state.prevKey || type !== state.prevType) {
                    state.key = count()
                    state.prevKey = key
                    state.prevType = type
                }
            }
            return (
                <SwitchTransition mode={props.mode}>
                    <CSSTransition
                        {...emit}
                        key={state.key}
                        ={props.name}
                        addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                        {children}
                    </CSSTransition>
                </SwitchTransition>
            )
        }
    },
})

const PlDisappearTransition = designClassComponent({
    props: {
        name: {type: String, required: true},
        show: {type: Boolean},
        timeout: {type: Number, default: 300},
        unmount: {type: Boolean},
    },
    slots: ['default'],
    emits: {
        onEnter: () => true,
        onExit: () => true,
        onEntered: () => true,
        onExited: () => true,
    },
    setup({props, slots, event: {emit}}) {

        const binding = props.unmount ? {} : {
            ...emit,
            onEnter: (el: HTMLElement) => {
                el.style.display = ''
                emit.onEnter()
            },
            onExited: (el: HTMLElement) => {
                el.style.display = 'none'
                emit.onExited()
            },
        }
        const cssRef = useReference<any>()

        if (!props.unmount && !props.show) {
            onBeforeMount(() => {
                const el = findDOMNode(cssRef.current) as HTMLElement | undefined
                !!el && (el.style.display = 'none')
            })
        }

        return () => {
            return (
                <CSSTransition
                    {...binding}
                    ref={cssRef}
                    in={props.show}
                    timeout={props.timeout}
                    ={props.name}
                    unmountOnExit={props.unmount}>
                    {slots.default()}
                </CSSTransition>
            )
        }
    },
})

/**
 * switch:      name,mode
 * disappear:   show,timeout,name
 * @author  韦胜健
 * @date    2021/3/19 21:44
 */
export const PlTransition: FC<{
    switch?: boolean,
    name: string,

    mode?: 'out-in' | 'in-out',

    show?: boolean,
    timeout?: number,
    unmount?: boolean,

    onEntered?: () => void,
    onExited?: () => void,
    onEnter?: () => void,
    onExit?: () => void,
}> = (props) => {
    if (props.switch) return <PlSwitchTransition {...props}/>
    else return <PlDisappearTransition {...props}/>
}

export default PlTransition
