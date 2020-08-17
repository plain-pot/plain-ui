import {PlcType} from "@/packages/table/plc/plc";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";
import {getCellClass, stickyFlag} from "@/packages/table/plc/plc-utils";
import {getCellStyles} from "@/packages/table/plc/plc-fixed";

/**
 * 写入公共的style以及class
 * @author  韦胜健
 * @date    2020/8/16 22:11
 */
export function writeStylesAndClasses(
    {
        headCols,
        headRowHeight,
        bodyRowHeight,
    }: {
        headCols: (PlcType | PlcGroupType)[][],
        headRowHeight: number,
        bodyRowHeight: number,
    }
) {
    headCols.forEach(list => {
        list.forEach((plc: PlcType | PlcGroupType) => {

            /*---------------------------------------head-------------------------------------------*/

            plc.styles.head.cell = getCellStyles(plc, (styles) => {
                styles.height = `${headRowHeight * plc.rowspan!}px`
                return styles
            })
            plc.styles.head.innerCell = {
                width: isPlcGroup(plc) ? undefined : `${plc.props.width}px`,
            }
            plc.classes.head.cell = [
                'plt-cell',
                'plt-head-cell',
                ...getCellClass(plc),
                {
                    'plt-cell-last-fixed-left': stickyFlag && plc.isLastFixedLeft,
                    'plt-cell-first-fixed-right': stickyFlag && plc.isFirstFixedRight,
                }
            ]
            plc.classes.head.innerCell = [
                'plt-inner-cell',
                {
                    'plt-inner-cell-no-padding': plc.props.noPadding
                }
            ]
            /*---------------------------------------body-------------------------------------------*/

            if (!isPlcGroup(plc)) {

                plc.styles.body.cell = getCellStyles(plc, (styles) => {
                    styles.height = `${bodyRowHeight}px`
                    return styles
                })
                plc.styles.body.innerCell = {
                    width: `${plc.props.width}px`,
                }
                plc.classes.body.cell = [
                    'plt-cell',
                    'plt-body-cell',
                    {
                        'plt-cell-add-edit-padding': plc.props.addEditPadding,
                        'plt-cell-last-fixed-left': stickyFlag && plc.isLastFixedLeft,
                        'plt-cell-first-fixed-right': stickyFlag && plc.isFirstFixedRight,
                    },
                ]
                plc.classes.body.innerCell = [
                    'plt-inner-cell',
                    {
                        'plt-inner-cell-no-padding': plc.props.noPadding
                    }
                ]
            }

        })
    })
}