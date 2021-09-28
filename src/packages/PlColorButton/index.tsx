import {designComponent,InheritHtmlElement, useRefs} from 'plain-design-composition'
import './color-button.scss'
// @ts-ignore
import opacityPng from './opacity.png'

export const PlColorButton = designComponent({
    name: 'pl-color-button',
    props: {
        color: {type: String}
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    inheritPropsType: InheritHtmlElement,
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class="pl-color-button" onClick={emit.onClick} ref={onRef.el}>
                    <div class="pl-color-button-background" style={{backgroundImage: `url(${opacityPng})`}}>
                        <div class="pl-color-button-color" style={{backgroundColor: props.color}}/>
                    </div>
                </div>
            )
        }
    },
})

export default PlColorButton
