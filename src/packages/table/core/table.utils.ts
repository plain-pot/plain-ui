import {StyleProps} from "../../../use/useStyle";
import {SimpleObject} from "../../../shims";
import {PropType} from 'vue';

export const TableProps = {
    ...StyleProps,
    data: {type: Array as PropType<SimpleObject[]>},            // 显示的数据

    /*---------------------------------------style-------------------------------------------*/
    headRowHeight: {type: [String, Number], default: 45},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 40},       // 表体行高
    showRows: {type: Number, default: 10},                      // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度

}