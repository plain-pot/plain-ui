import {onBeforeUnmount, watch} from 'vue';
import './click-wave.scss'
import {delay} from "plain-utils/utils/delay";

export interface ClickWaveOptions {
    disabled?: boolean,
    size?: 'large' | 'normal' | 'mini',
}

function createClickWaveManager(el: HTMLElement, o?: ClickWaveOptions | string) {
    let option: ClickWaveOptions;
    let wavingTimer = null as null | number

    const onClick = () => {
        // console.log(this.option,this.option.disabled === true)
        if (option.disabled) return;
        if (!!wavingTimer) return
        el.setAttribute('plain-click-node-waving', 'active')
        wavingTimer = setTimeout(() => {
            el.removeAttribute('plain-click-node-waving')
            wavingTimer = null
        }, 500) as any as number
    }

    const updateOption = (o?: ClickWaveOptions | string) => {
        o = o || {}
        if (typeof o === "string") {
            o = {size: o as any}
        }
        o.size = o.size || 'normal'
        option = o
    }

    updateOption(o)
    el.setAttribute(`plain-click-node-${option!.size}`, 'active')
    el.addEventListener('click', onClick, true)

    return {
        updateOption,
        destroy: () => {el.removeEventListener('click', onClick, true)},
    }
}

type WaveManager = ReturnType<typeof createClickWaveManager>

/**
 * 代替 plain-ui for Vue3.0 中 v-click-wave 指令
 * @author  韦胜健
 * @date    2021/3/16 11:03
 */
export function useClickWave(
    {
        elGetter,
        optionsGetter,
    }: {
        elGetter: () => HTMLElement | undefined | null,
        optionsGetter?: () => string | ClickWaveOptions,
    }) {

    const state = {
        waveManager: null as null | WaveManager,
    }

    watch(elGetter, async el => {
        await delay(0)
        if (!!state.waveManager) {state.waveManager.destroy()}
        state.waveManager = null
        !!el && (state.waveManager = createClickWaveManager(el, !!optionsGetter ? optionsGetter() : undefined))
    }, {immediate: true})

    !!optionsGetter && watch(optionsGetter, opt => {
        !!state.waveManager && state.waveManager.updateOption(opt)
    })

    onBeforeUnmount(() => {
        !!state.waveManager && state.waveManager.destroy()
    })
}