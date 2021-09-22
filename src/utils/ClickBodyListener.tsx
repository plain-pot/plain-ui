interface ClickListener {
    (e: MouseEvent): void
}

export const ClickBodyListener = (() => {

    const state = {
        handlers: [] as ClickListener[],
        disabled: false,
    }

    const onClickBody = (e: MouseEvent) => {
        if (state.disabled) {return}
        state.handlers.forEach(h => h(e))
    }

    document.body.addEventListener('click', onClickBody, true)

    const disable = () => state.disabled = true
    const enable = () => state.disabled = false
    const listen = (handler: ClickListener) => {
        state.handlers.indexOf(handler) === -1 && state.handlers.push(handler)
        return () => eject(handler)
    }
    const eject = (handler: ClickListener) => {
        const index = state.handlers.indexOf(handler)
        index >= 1 && state.handlers.splice(index, 1)
    }

    return {
        disable,
        enable,
        listen,
        eject,
    }
})();