import {KeyBoardMap} from "../../keyboard";
import {tTableOptionHooks} from "./use.hooks";
import {onBeforeUnmount} from "plain-design-composition";

export function useTableOptionCommand({hooks}: { hooks: tTableOptionHooks }) {

    const state = {
        tableEl: null as null | HTMLDivElement,
        listener: [] as [string, ((e: KeyboardEvent) => void)][],
        count: 1,
    }

    const getMatchHandler = (e: KeyboardEvent) => {
        if (e.currentTarget !== e.target) return
        const names = [] as string[];
        (e.metaKey || e.ctrlKey) && names.push('ctrl')
        e.shiftKey && names.push('shift')
        e.altKey && names.push('alt')
        names.push((KeyBoardMap as any)[e.keyCode])
        const compositionKeyName = names.join('+')

        const listener = [...state.listener]
        let item = listener.shift()
        while (!!item) {
            const [command, handler] = item
            if (command === compositionKeyName) {
                return handler
            } else {
                item = listener.shift()
            }
        }
        return
    }

    const onKeydown = (e: KeyboardEvent) => {
        const handler = getMatchHandler(e)
        if (!!handler) {
            e.stopPropagation()
            e.preventDefault()
        }
        if (state.count > 0) {
            if (!!handler) {handler(e)}
        }
    }

    const onKeyup = (e: KeyboardEvent) => {
        state.count = 1
    }

    const onEnter = () => {
        document.body.addEventListener('keydown', onKeydown, true)
        document.body.addEventListener('keyup', onKeyup, true)
    }

    const onLeave = () => {
        document.body.removeEventListener('keydown', onKeydown, true)
        document.body.removeEventListener('keyup', onKeyup, true)
    }

    hooks.onRefTableProEl.use((el) => {
        if (!el) {return}
        state.tableEl = el
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
    })

    onBeforeUnmount(() => {
        document.body.removeEventListener('keydown', onKeydown, true)
        document.body.removeEventListener('keyup', onKeyup, true)
        !!state.tableEl && state.tableEl!.removeEventListener('mouseenter', onEnter)
        !!state.tableEl && state.tableEl!.removeEventListener('mouseleave', onLeave)
    })

    const on = (command: string, handler: (e: KeyboardEvent) => void) => {
        state.listener.push([command, handler])
    }

    return {
        on,
    }

}

export type tTableOptionCommand = ReturnType<typeof useTableOptionCommand>
