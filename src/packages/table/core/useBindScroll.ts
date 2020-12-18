import {TableHoverPart} from "./table.utils";
import {ref} from 'vue';

/**
 * 绑定表头表体联动滚动
 * @author  韦胜健
 * @date    2020/12/18 16:27
 */
export function useBindScroll(
    event: {
        emit: {
            onScrollLeft: (scrollLeft: number, part: TableHoverPart) => void,
        },
        on: {
            onScrollLeft: (cb: (scrollLeft: number, part: TableHoverPart) => void) => void,
        },
    }
) {
    const hoverPart = ref(null as null | TableHoverPart)
    return {
        bindScroll: (part: TableHoverPart, updateLeft: (left: number, part: TableHoverPart) => void) => {
            event.on.onScrollLeft((left, part) => updateLeft(left, part))
            return {
                onMouseenter: () => hoverPart.value = part,
                onScroll: (e: Event) => hoverPart.value === part && event.emit.onScrollLeft((e as any).target.scrollLeft, part)
            }
        }
    }
}