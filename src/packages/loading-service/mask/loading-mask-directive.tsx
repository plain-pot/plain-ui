import {Directive, reactive, App} from 'vue';
import {designComponent} from "../../../use/designComponent";
import {newInstance} from "../../../utils/newInstance";
import LoadingMaskPlugin from '../../loading-mask'
import LoadingPlugin from '../../loading'
import {PlLoadingMask} from "../../loading-mask/loading-mask";

type LoadingMaskBinding = boolean | {
    modelValue?: boolean,
    message?: string,
    loadingType?: 'alpha' | 'beta' | 'gamma' | 'delta',
    background?: string,
    unlock?: boolean,
}

const Mask = designComponent({
    setup() {
        const state = reactive({
            option: null as null | LoadingMaskBinding & { modelValue?: boolean }
        })
        return {
            refer: {
                update: (option: LoadingMaskBinding) => {
                    state.option = typeof option === "object" ?
                        {
                            ...option,
                            modelValue: option.modelValue === undefined ? true : option.modelValue
                        }
                        : {modelValue: option}
                }
            },
            render: () => (
                !!state.option ? <PlLoadingMask {...state.option} inDirective/> : null
            )
        }
    },
})

class LoadingMask {

    mask?: {
        app: App,
        ins: typeof Mask.use.class,
        el: HTMLElement
    }

    constructor(private el: HTMLElement) {}

    update(binding: LoadingMaskBinding) {
        const flag = typeof binding === "object" ? true : binding
        flag ? this.show(binding) : this.hide()
    }

    show(binding: LoadingMaskBinding) {
        if (!this.mask) {
            this.mask = newInstance(Mask, {
                parentNode: this.el,
                plugins: [
                    LoadingPlugin,
                    LoadingMaskPlugin
                ]
            })
        }
        this.mask.ins.update(binding)
    }

    hide() {
        if (!!this.mask) {
            this.mask.ins.update(false)
        }
    }

    destroy() {
        if (!!this.mask) {
            this.mask.app.unmount(this.mask.el)
        }
    }
}

const directive = (() => {
    let map = new WeakMap<HTMLElement, LoadingMask>()
    return {
        active: (el: HTMLElement, binding: { value: LoadingMaskBinding }) => {
            // console.log('active', binding.value);
            const flag = typeof binding.value === "object" ? true : binding.value
            let loadingMask = map.get(el)
            if (flag) {
                /*第一次显示的时候才创建实例*/
                if (!loadingMask) {
                    loadingMask = new LoadingMask(el)
                    map.set(el, loadingMask)
                }
                loadingMask.update(binding.value)
            } else {
                if (!!loadingMask) {
                    loadingMask.update(binding.value)
                }
            }
        },
        inactive: (el: HTMLElement) => {
            // console.log('inactive');
            const loadingMask = map.get(el)
            if (!!loadingMask) {
                loadingMask.destroy()
            }
        }
    }
})()

export const LoadingMaskDirective: Directive = {
    mounted: directive.active,
    updated: directive.active,
    beforeUnmount: directive.inactive,
}