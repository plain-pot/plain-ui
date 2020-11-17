import {createPlainTooltipPopper, PlainTooltipAnimate, PlainTooltipAnimates, PlainTooltipAnimateType, PlainTooltipConfig, PlainTooltipTheme, PlainTooltipThemes, PlainTooltipTrigger, PlainTooltipTriggers, PlainTooltipTriggerType} from "./PlainTooltipUtils";
import {PlainPopper} from "./PlainPopper";

export class PlainTooltip {

    state = {
        isMounted: false,                                   // 当前是否已经将 popperElement 添加到文档
        isShow: false,                                      // 当前是否已经显示

        contentEl: null as null | HTMLElement,              // content节点
        popperEl: null as null | HTMLElement,               // popper节点
        popper: null as null | PlainPopper,                 // new PlainPopper()得到的对象实例
        animate: null as null | PlainTooltipAnimateType,    // 动画
        trigger: null as null | ReturnType<PlainTooltipTriggerType>,    // 触发器

        onContentTransitionEnd: null as null | Function,    // 监听动画结束后的动作
    }

    constructor(public config: PlainTooltipConfig) {
        (config.removeOnHide == null && (config.removeOnHide = true));
        (config.theme == null && (config.theme = PlainTooltipTheme.dark));
        (config.animate == null && (config.animate = PlainTooltipAnimate.scale));
        (config.trigger == null && (config.trigger = PlainTooltipTrigger.hover));
        (config.placement == null && (config.placement = 'top'));
        (config.hoverDelay == null && (config.hoverDelay = 100));

        const {
            reference,
            offset,
            boundary,
            placement,
            arrowSize,
            gpuAcceleration,
            padding,
        } = config

        const {popper, content} = createPlainTooltipPopper()

        if (typeof config.content === 'string') {
            const textEl = document.createElement('span')
            textEl.innerHTML = config.content
            content.appendChild(textEl)
        } else {
            content.appendChild(config.content)
        }

        this.state.contentEl = content
        this.state.popperEl = popper

        /*theme*/
        if (!PlainTooltipThemes[config.theme!]) {
            throw new Error(`PlainTooltip: Can not recognise theme:${config.theme}`)
        }
        PlainTooltipThemes[config.theme!]({
            content: this.state.contentEl!,
            popper: this.state.popperEl!,
        });

        /*animate*/
        if (!PlainTooltipAnimates[config.animate!]) {
            throw new Error(`PlainTooltip: Can not recognise animate:${config.animate}`)
        }
        this.state.animate = PlainTooltipAnimates[config.animate!]
        this.hide()

        /*trigger*/
        if (!PlainTooltipTriggers[config.trigger!]) {
            throw new Error(`PlainTooltip: Can not recognise trigger:${config.trigger}`)
        }
        this.state.trigger = PlainTooltipTriggers[config.trigger!](this)

        /*popper*/
        this.state.popper = new PlainPopper({
            popper,

            reference,
            offset,
            boundary,
            placement,
            arrowSize,
            gpuAcceleration,
            padding,
        })

        content.addEventListener('transitionend', this.handler.onContentTransitionEnd)
        this.state.trigger.init()
    }

    handler = {
        onContentTransitionEnd: (e: Event) => {
            !!this.state.onContentTransitionEnd && this.state.onContentTransitionEnd(e)
        }
    }

    show = () => {
        if (!this.state.isMounted) {
            document.body.appendChild(this.state.popperEl!)
            this.state.isMounted = true
            this.state.popper!.refresh()
        }
        Object.assign(this.state.contentEl!.style, this.state.animate!.show)
        this.state.isShow = true
        this.state.onContentTransitionEnd = null
    }

    hide = () => {
        Object.assign(this.state.contentEl!.style, this.state.animate!.hide)
        this.state.isShow = false
        this.state.onContentTransitionEnd = () => {
            if (!!this.config.removeOnHide && this.state.isMounted) {
                document.body.removeChild(this.state.popperEl!)
                this.state.isMounted = false
            }
            this.state.onContentTransitionEnd = null
        }
    }

    toggle = () => {
        this.state.isShow ? this.hide() : this.show()
    }


    destroy = () => {
        this.state.trigger!.destroy()
        this.state.contentEl!.removeEventListener('transitionend', this.handler.onContentTransitionEnd)
        if (this.state.isMounted) document.body.removeChild(this.state.popperEl!)
        this.state.popper!.destroy()
    }

}