import {designComponent} from "../../use/designComponent";

const opacityBg = require('./sub/opacity.png')

export const PlColorButton = designComponent({
    name: 'pl-color-button',
    props: {
        color: {type: String}
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {
        return {
            render: () => (
                <div class="pl-color-button" onClick={emit.onClick}>
                    <div class="pl-color-button-background" style={{backgroundImage: `url(${opacityBg})`}}>
                        <div class="pl-color-button-color" style={{backgroundColor: props.color}}/>
                    </div>
                </div>
            )
        }
    },
})