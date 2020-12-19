/**
 * 处理表头拖拽调整宽度的功能
 * @author  韦胜健
 * @date    2020/8/18 16:17
 */
import {TablePlc} from "../../plc/core/plc.type";
import Table from "../../table";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";

export function useHeadCellResize(table: typeof Table.use.class, plc: TablePlc) {

    const state = {
        indicatorEl: null as null | HTMLElement,
        startX: null as null | number,
        endX: null as null | number,
    }

    const handler = {
        mousedown: (e: MouseEvent) => {

            const tableEl = table.refs.el

            e.preventDefault()
            e.stopPropagation()

            window.addEventListener('mousemove', handler.mousemove)
            window.addEventListener('mouseup', handler.mouseup)
            disabledUserSelect()
            state.startX = e.clientX

            state.indicatorEl = document.createElement('div')

            const cell = e.currentTarget as HTMLElement

            const {left, width} = cell.getBoundingClientRect()
            const {top, height} = tableEl.getBoundingClientRect()

            Object.assign(state.indicatorEl.style, {
                display: 'inline-block',
                zIndex: 9999,
                position: 'fixed',

                width: `${width}px`,
                backgroundColor: '#ddd',
                height: `${height}px`,
                top: `${top}px`,
                left: `${left}px`,
            })

            document.body.appendChild(state.indicatorEl)
        },
        mousemove: (e: MouseEvent) => {
            state.indicatorEl!.style.left = `${e.clientX}px`
        },
        mouseup: (e: MouseEvent) => {
            window.removeEventListener('mousemove', handler.mousemove)
            window.removeEventListener('mouseup', handler.mouseup)
            enableUserSelect()
            document.body.removeChild(state.indicatorEl!)
            state.endX = e.clientX
            let durWidth = state.endX - state.startX!
            plc.setDurWidth(durWidth)
        }
    }

    return {
        resizeHandler: handler,
    }
}