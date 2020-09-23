import {PlainPopperConfig} from "./PlainPopperUtils";
import {StyleType} from "@/types/utils";
import {PlainTooltip} from "./PlainTooltip";

export enum PlainTooltipTheme {
    light = 'light',
    dark = 'dark',
    error = 'error',
    success = 'success',
}

export enum PlainTooltipAnimate {
    scale = 'scale',
    fade = 'fade',
}

export enum PlainTooltipTrigger {
    focus = 'focus',
    click = 'click',
    hover = 'hover',
    always = 'always',
    manual = 'manual',
}

export interface PlainTooltipConfig extends PlainPopperConfig {
    content: string | HTMLElement,                              // 提示内容 
    removeOnHide?: boolean                                      // 是否在关闭的时候移除dom
    theme?: PlainTooltipTheme,                                  // 主题，lite以及dark
    animate?: PlainTooltipAnimate,                              // 动画，fade，scale
    trigger?: PlainTooltipTrigger,                              // 触发器，click、focus、hover、always、manual
    hoverDelay?: number,                                        // 打开的时候延迟触发器，仅对hover有效
}

export interface PlainTooltipThemeTtype {
    (el: { content: HTMLElement, popper: HTMLElement }): void
}

export const PlainTooltipThemes: { [k: string]: PlainTooltipThemeTtype } = {
    dark: ({content}) => {
        content.style.backgroundColor = '#444'
        content.style.color = '#fff'
    },
    light: ({content}) => {
        content.style.backgroundColor = '#fff'
        content.style.color = '#666'
    },
}

export interface PlainTooltipAnimateType {
    show: StyleType,
    hide: StyleType,
}

export const PlainTooltipAnimates: { [k: string]: PlainTooltipAnimateType } = {
    drop: {
        show: {
            opacity: '1',
            transform: `scaleY(1)`
        },
        hide: {
            opacity: '0',
            transform: `scaleY(0)`
        },
    },
    scale: {
        show: {
            opacity: '1',
            transform: `scale(1)`
        },
        hide: {
            opacity: '0',
            transform: `scale(0.75)`
        },
    },
    fade: {
        show: {
            opacity: '1',
            transform: `scaleY(1)`                  //show和hide没有这个scaleY的话，在ie下arrow元素不会消失
        },
        hide: {
            opacity: '0',
            transform: `scaleY(1)`
        },
    },
}

export interface PlainTooltipTriggerType {
    init: (ctx: PlainTooltip, reference: HTMLElement) => any,
    destroy: (ctx: PlainTooltip, reference: HTMLElement) => any,
}

export const PlainTooltipTriggers: { [k: string]: PlainTooltipTriggerType } = {
    /*手动控制*/
    manual: {init: () => null, destroy: () => null},
    /*总是显示*/
    always: {
        init: (instance) => instance.show(),
        destroy: () => null
    },
    /*target获取焦点的时候显示*/
    focus: {
        init(instance, target: HTMLElement) {
            instance.triggerHandler = {focus: () => instance.show(), blur: () => instance.hide(),}
            target.addEventListener('focus', instance.triggerHandler.focus)
            target.addEventListener('blur', instance.triggerHandler.blur)
        },
        destroy(instance, target: HTMLElement) {
            target.removeEventListener('focus', instance.triggerHandler.focus)
            target.removeEventListener('blur', instance.triggerHandler.blur)
        },
    },
    /*target被点击的时候切换显示*/
    click: {
        init(instance, target: HTMLElement) {
            instance.triggerHandler = () => {
                if (instance.state.isShow) instance.hide()
                else instance.show()
            }
            target.addEventListener('click', instance.triggerHandler)
        },
        destroy(instance, target: HTMLElement) {
            target.removeEventListener('click', instance.triggerHandler)
        },
    },
    /*鼠标选择在target上时显示*/
    hover: {
        init(instance, target: HTMLElement) {
            instance.triggerHandler = {
                mouseenter: () => instance.show(),
                mouseleave: () => instance.hide(),
            }
            target.addEventListener('mouseenter', instance.triggerHandler.mouseenter)
            target.addEventListener('mouseleave', instance.triggerHandler.mouseleave)
        },
        destroy(instance, target: HTMLElement) {
            target.removeEventListener('mouseenter', instance.triggerHandler.mouseenter)
            target.removeEventListener('mouseleave', instance.triggerHandler.mouseleave)
        },
    },
}

/**
 * 添加class
 * @author 韦胜健
 * @date 2018/11/19
 */
export const addClass = (el: HTMLElement, addCLs: string | string[]): void => {
    if (!el || !addCLs) return;
    let addClasses;
    if (Array.isArray(addCLs)) {
        addClasses = addCLs
    } else {
        addClasses = (addCLs as string).split(' ')
    }
    if (!!el.classList && !!el.classList.value) {
        addClasses.forEach(item => el.classList.add(item))
    } else {
        const curClasses = (el.className || '').split(' ')
        addClasses.forEach(item => {
            if (curClasses.indexOf(item) === -1) curClasses.push(item)
        })
        el.className = curClasses.join(' ')
    }
}

export const createPlainTooltipPopper = (() => {
    let cache: {
        popper: HTMLElement,
        content: HTMLElement,
        arrow: HTMLElement,
    };

    return () => {
        if (!cache) {
            let popperEl = document.createElement('div')
            addClass(popperEl, 'plain-popper')

            let contentEl = document.createElement('div') as HTMLElement
            addClass(contentEl, 'plain-popper-content')
            popperEl.appendChild(contentEl)

            Object.assign(contentEl.style, {
                borderRadius: '2px',
                transition: `all 300ms cubic-bezier(0.23, 1, 0.32, 1)`,
                padding: '8px 12px',
                boxSizing: 'border-box',
                fontSize: '12px',
                maxWidth: '500px',
            })

            let arrowEl = document.createElement('div') as HTMLElement;
            addClass(arrowEl, 'plain-popper-arrow');
            contentEl.appendChild(arrowEl);

            cache = {
                popper: popperEl,
                content: contentEl,
                arrow: arrowEl,
            }
        }

        const popper = cache.popper.cloneNode(true) as HTMLElement
        const content = popper.querySelector('.plain-popper-content') as HTMLElement
        const arrow = content.querySelector('.plain-popper-arrow') as HTMLElement

        return {
            popper,
            content,
            arrow,
        }
    }
})()