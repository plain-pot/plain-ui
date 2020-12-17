import {StyleProps} from "../../../use/useStyle";
import {SimpleObject} from "../../../shims";
import {PropType} from 'vue';

export const TableProps = {
    ...StyleProps,
    data: {type: Array as PropType<SimpleObject[]>},            // 显示的数据

    /*---------------------------------------style-------------------------------------------*/
    headRowHeight: {type: [String, Number], default: 45},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 40},       // 表体行高

}