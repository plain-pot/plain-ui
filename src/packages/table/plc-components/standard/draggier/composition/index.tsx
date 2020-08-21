/**
 * 拖拽排序实现函数的类型
 * @author  韦胜健
 * @date    2020/8/21 10:07
 */
import {useListDraggierWithVirtual} from "@/packages/table/plc-components/standard/draggier/composition/use-list-draggier.virtual";
import {useListDraggierNotVirtual} from "@/packages/table/plc-components/standard/draggier/composition/use-list-draggier";

export interface UseListDraggierType {
    (option: {
        rowClass: string,                                                               // 行的class，要确保只有行所在的dom对象有这个class，其子节点是没有这个class的
        onChange: (start: number, end: number) => void | Promise<void>,                 // 拖拽导致排序变化动作
        virtual?: boolean,                                                              // 是否为虚拟滚动
    }): {
        handler: {
            mousedown: (e: MouseEvent) => void,
        }
    }
}

export const useListDraggier: UseListDraggierType = (option) => {
    if (option.virtual) {
        return useListDraggierWithVirtual(option)
    } else {
        return useListDraggierNotVirtual(option)
    }
}