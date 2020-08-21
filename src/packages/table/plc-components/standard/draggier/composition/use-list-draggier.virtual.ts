import {UseListDraggierType} from "@/packages/table/plc-components/standard/draggier/composition/index";

/**
 * 拖拽排序组合函数，适用于虚拟滚动版本的
 * @author  韦胜健
 * @date    2020/8/21 10:27
 */
export const useListDraggierWithVirtual: UseListDraggierType = (
    {
        rowClass,
        onChange,
    }) => {

    const state = {}

    const handler = {
        mousedown: (e: MouseEvent) => {

        }
    }

    return {
        handler
    }

}