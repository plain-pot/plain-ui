import {StyleProps} from "../../../use/useStyle";
import {SimpleObject} from "../../../shims";
import {PropType} from 'vue';
import {TablePlc} from "../plc/core/plc.type";

export type TablePropsConfig = (plcList: TablePlc[]) => Record<string, any>

export type TableNode = {}

export enum TablePlcAlign {
    left = 'left',
    center = 'center',
    right = 'right',
}

export enum TablePlcFixedType {
    left = 'left',
    center = 'center',
    right = 'right',
}

export const enum TableHoverPart {
    body = 'body',
    head = 'head'
}

export const TableProps = {
    ...StyleProps,
    data: {type: Array as PropType<SimpleObject[]>},            // 显示的数据

    /*---------------------------------------style-------------------------------------------*/
    headRowHeight: {type: [String, Number], default: 45},       // 表头行高
    bodyRowHeight: {type: [String, Number], default: 40},       // 表体行高
    showRows: {type: Number, default: 10},                      // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度

    config: {type: Function as PropType<TablePropsConfig>},     // 配置列信息函数
}