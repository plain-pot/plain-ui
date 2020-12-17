import {PlcType, TablePlc} from "../plc-core/plc.type";
import {StyleProperties} from "../../../shims";
import {TablePlcFixedType} from "../plc-core/plc.utils";

/**
 * 根据plc.props.fixed
 * 获取单元格td的固定样式
 * @author  韦胜健
 * @date    2020/8/14 17:06
 */
export function getCellStyles(plc: TablePlc, adjust: (styles: StyleProperties) => StyleProperties) {

    if (plc.props.fixed === TablePlcFixedType.center) {
        return adjust({})
    }

    const ret = {} as StyleProperties
    ret.position = 'sticky'
    ret.zIndex = '3'

    if (!plc.group) {
        ret[plc.props.fixed] = plc.fixedPosition[plc.props.fixed] + 'px'
    } else {
        let count = 10
        const fixedLeft = plc.props.fixed === TablePlcFixedType.left
        while (!!plc && plc.group && count > 0) {
            plc = plc.children[fixedLeft ? 0 : plc.children.length - 1]
            count--
        }
        if (count === 0 && !!plc) {
            throw new Error('解析异常')
        }
        if (!!plc) {
            // @ts-ignore
            ret[plc.props.fixed] = plc.fixedPosition[plc.props.fixed] + 'px'
        }
    }
    return adjust(ret)
}

/**
 * 给plc的固定列计算sticky的偏移距离
 * @author  韦胜健
 * @date    2020/8/14 17:06
 */
export const writeFixedPosition = (flatPlcList: PlcType[]) => {

    const collector = flatPlcList.reduce((ret, item) => {
        switch (item.props.fixed) {
            case TablePlcFixedType.left:
                ret.left.push(item)
                break
            case TablePlcFixedType.right:
                ret.right.push(item)
                break
        }
        return ret
    }, {
        left: [] as PlcType[],
        right: [] as PlcType[],
    });

    const width = {
        left: 0,
        right: 0,
    }

    const keys = Object.keys(collector) as ['left', 'right']
    keys.forEach((key) => {
        let list = collector[key]!
        if (key === 'right') {
            list = list.reverse()
        }
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            width[key] += element.props.width
            if (i === 0) {
                element.fixedPosition[key] = 0
            } else {
                const {props: {width: prevWidth}, fixedPosition: {[key]: prevValue}} = list[i - 1]!
                element.fixedPosition[key] = Number(prevWidth) + prevValue
            }
        }
    })
}