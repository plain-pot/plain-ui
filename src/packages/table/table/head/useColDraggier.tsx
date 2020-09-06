import {$plain} from "@/packages/base";

export function useColDraggier(option: {
    colDraggable: boolean,
}) {

    if (!option.colDraggable) {
        return {}
    }

    const state = {}

    const on = {
        mousedown: (e: MouseEvent) => {

            $plain.disableSelect()
            console.log('mousedown')

            document.addEventListener('mouseup', on.mouseup)

        },
        mouseup: () => {
            $plain.enableSelect()
        }
    }

    return {
        tdBinding: {
            on,
        },
    }

}