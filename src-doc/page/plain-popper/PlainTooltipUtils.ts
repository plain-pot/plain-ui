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
    drop = 'drop',
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
    (ins: PlainTooltip): {
        init: () => any,
        destroy: () => any,
    }
}

export const PlainTooltipTriggers: { [k: string]: PlainTooltipTriggerType } = {
    /*手动控制*/
    manual: () => ({init: () => null, destroy: () => null}),
    /*总是显示*/
    always: (ins) => ({
        init: () => ins.show(),
        destroy: () => null
    }),
    /*target获取焦点的时候显示*/
    focus: ins => {
        const {reference} = ins.config
        const handler = {focus: () => ins.show(), blur: () => ins.hide()}
        return ({
            init() {
                reference.addEventListener('focus', handler.focus)
                reference.addEventListener('blur', handler.blur)
            },
            destroy() {
                reference.removeEventListener('focus', handler.focus)
                reference.removeEventListener('blur', handler.blur)
            },
        })
    },
    /*target被点击的时候切换显示*/
    click: ins => {
        const {config: {reference}, state: {contentEl}} = ins
        const handler = {
            clickReference: ins.toggle,
            clickBody: (e: MouseEvent) => {
                if (reference.contains(e.target as Node)) {
                    /*点击了reference*/
                    return
                }
                if (contentEl!.contains(e.target as Node)) {
                    /*点击了content*/
                    return
                }
                ins.hide()
            }
        }
        return ({
            init() {
                reference.addEventListener('click', handler.clickReference)
                window.addEventListener('click', handler.clickBody)
            },
            destroy() {
                reference.removeEventListener('click', handler.clickReference)
                window.removeEventListener('click', handler.clickBody)
            },
        })
    },
    /*鼠标选择在target上时显示*/
    hover: ins => {

        const {config: {reference, hoverDelay}, state: {contentEl}, show, hide} = ins

        let closeTimer: number | undefined;
        let openTimer: number | undefined;


        const handler = {
            reference: {
                enter: () => {
                    if (!!closeTimer) {
                        clearTimeout(closeTimer)
                        closeTimer = undefined
                    }
                    openTimer = setTimeout(() => {
                        show()
                        openTimer = undefined
                    }, hoverDelay)
                },
                leave: () => {
                    if (!!openTimer) {
                        clearTimeout(openTimer)
                        openTimer = undefined
                    }
                    closeTimer = setTimeout(() => {
                        hide()
                        closeTimer = undefined
                    }, hoverDelay)
                },
            },
            popper: {
                enter: () => {
                    if (!!closeTimer) {
                        clearTimeout(closeTimer)
                        closeTimer = undefined
                    }
                    openTimer = setTimeout(() => {
                        show()
                        openTimer = undefined
                    }, hoverDelay)
                },
                leave: () => {
                    if (!!openTimer) {
                        clearTimeout(openTimer)
                        openTimer = undefined
                    }
                    closeTimer = setTimeout(() => {
                        hide()
                        closeTimer = undefined
                    }, hoverDelay)
                },
            },
        }

        return {
            init() {
                reference.addEventListener('mouseenter', handler.reference.enter)
                reference.addEventListener('mouseleave', handler.reference.leave)
                contentEl!.addEventListener('mouseenter', handler.popper.enter)
                contentEl!.addEventListener('mouseleave', handler.popper.leave)
            },
            destroy() {
                reference.removeEventListener('mouseenter', handler.reference.enter)
                reference.removeEventListener('mouseleave', handler.reference.leave)
                contentEl!.removeEventListener('mouseenter', handler.popper.enter)
                contentEl!.removeEventListener('mouseleave', handler.popper.leave)
            },
        }
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
                boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.15)',
                fontSize: '12px',
                maxWidth: '500px',
                zIndex: '999',
            } as StyleType)

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