import {PlcType} from "@/packages/table/plc/plc";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType} from "@/packages/table/plc/plc-utils";

export function writeStylesAndClasses(
    {
        headCols,
        rowHeight,
    }: {
        headCols: (PlcType | PlcGroupType)[][],
        rowHeight: number,
    }
) {
    headCols.forEach(list => {
        list.forEach((plc) => {
            plc.styles.cellStyle = {
                height: `${rowHeight * plc.rowspan!}px`
            }
            plc.styles.innerCellStyle = {
                width: isPlcGroup(plc) ? undefined : `${plc.props.width}px`,
            }

            plc.classes.cellClasses = [
                'plt-cell',
            ]

            plc.classes.innerCellClass = [
                'plt-inner-cell',
            ]
        })
    })
}