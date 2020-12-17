/**
 * 写入公共的style以及class
 * @author  韦胜健
 * @date    2020/8/16 22:11
 */
import {TablePlc} from "../plc-core/plc.type";
import {getCellStyles} from "./plc.fixed";
import {TableNode} from "../table-core/node";
import {TablePlcAlign} from "../plc-core/plc.utils";

export function getCellClass(plc: TablePlc, node?: TableNode) {
    return [
        `plt-cell-align-${plc.props.align || TablePlcAlign.left}`,
        {
            'pl-cell-group': plc.group,
        }
    ]
}

export function writeStylesAndClasses(
    {
        headCols,
        headRowHeight,
        bodyRowHeight,
    }: {
        headCols: TablePlc[][],
        headRowHeight: number,
        bodyRowHeight: number,
    }
) {
    headCols.forEach(list => {
        list.forEach((plc: TablePlc) => {

            /*---------------------------------------head-------------------------------------------*/

            plc.styles.head.cell = getCellStyles(plc, (styles) => {
                // styles.height = `${headRowHeight * plc.rowspan!}px`
                return styles
            })
            plc.styles.head.innerCell = {
                // width: isPlcGroup(plc) ? undefined : `${plc.props.width}px`,
                // lineHeight: `${headRowHeight * plc.rowspan!}px`,
                height: `${headRowHeight * plc.rowspan!}px`,
            }
            plc.classes.head.cell = [
                'plt-cell',
                'plt-head-cell',
                ...getCellClass(plc),
                {
                    'plt-cell-last-fixed-left': plc.isLastFixedLeft,
                    'plt-cell-first-fixed-right': plc.isFirstFixedRight,
                }
            ]
            plc.classes.head.innerCell = [
                'plt-inner-cell',
                {
                    'plt-inner-cell-no-padding': plc.props.noPadding
                }
            ]
            /*---------------------------------------body-------------------------------------------*/

            if (!plc.group) {

                plc.styles.body.cell = getCellStyles(plc, (styles) => {
                    // styles.height = `${bodyRowHeight}px`
                    return styles
                })
                plc.styles.body.innerCell = {
                    // width: `${plc.props.width}px`,
                    // lineHeight: `${bodyRowHeight}px`,
                    height: `${bodyRowHeight}px`,
                }
                plc.classes.body.cell = [
                    'plt-cell',
                    'plt-body-cell',
                    {
                        'plt-cell-add-edit-padding': plc.props.addEditPadding,
                        'plt-cell-last-fixed-left': plc.isLastFixedLeft,
                        'plt-cell-first-fixed-right': plc.isFirstFixedRight,
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