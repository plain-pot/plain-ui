import {tPlc, tPlcType} from "../../utils/plc.type";
import {TablePlcFixedType} from "../../../table/utils/table.utils";
import {StyleProperties} from "plain-design-composition"

/**
 * 处理plc的fixed定位
 * @author  韦胜健
 * @date    2020/12/19 16:50
 */
export function processPlcFixed(flatPlcList: tPlc[]) {
    const collect = (() => {
        const left = [] as tPlc[]
        const right = [] as tPlc[]
        flatPlcList.forEach(plc => {
            switch (plc.props.fixed) {
                case TablePlcFixedType.left:
                    left.push(plc)
                    break
                case TablePlcFixedType.right:
                    right.push(plc)
                    break
            }
        })
        return {
            left,
            right,
        }
    })();
    const width = {
        left: 0,
        right: 0,
    };
    Object.keys(collect).forEach((item) => {
        const key = item as 'left' | 'right'
        let list = collect[key]!
        if (key === 'right') {list = list.reverse()}

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

/**
 * 获取plcFixed样式
 * @author  韦胜健
 * @date    2020/12/19 16:55
 */
export function getPlcFixedStyle(plc: tPlcType) {
    const {props: {fixed}} = plc
    const styles = {} as StyleProperties
    if (fixed === TablePlcFixedType.center) {
        return styles
    }
    styles.position = 'sticky'
    styles.zIndex = 3

    if (!plc.group) {
        (styles as any)[fixed] = (plc.fixedPosition as any)[fixed] + 'px'
    } else {
        let count = 10
        const isFixedLeft = fixed === TablePlcFixedType.left
        while (!!plc && plc.group && count > 0) {
            plc = plc.children[isFixedLeft ? 0 : plc.children.length - 1]
            count--
        }
        if (count === 0 && !!plc) {
            throw new Error('解析异常')
        }
        if (!!plc) {
            (styles as any)[fixed] = (plc.fixedPosition as any)[fixed] + 'px'
        }
    }
    return styles
}