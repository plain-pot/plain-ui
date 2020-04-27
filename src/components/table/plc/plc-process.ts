import {Plc, PlcFixedType, PlcType} from "./plc-utils";
// @ts-ignore
import PlainUtils from 'plain-utils'

/**
 * 深度遍历plc数组
 * @author  韦胜健
 * @date    2020/4/26 11:29
 */
function iteratePlcList(plcList: Plc[], handler: (plc: Plc) => void) {
    if (!plcList || plcList.length === 0) return
    plcList.forEach(plc => {
        handler(plc)
        if (plc.group) {
            iteratePlcList(plc.children, handler)
        }
    })
}

/**
 * 展开 plc list
 * @author  韦胜健
 * @date    2020/4/26 11:09
 */
function expandPlcList(plcList: Plc[]): Plc[] {
    if (!plcList) return []

    return plcList.reduce((ret: Plc[], plc: Plc) => {

        switch (plc.plcType) {
            case PlcType.LIST:
                ret.push(...expandPlcList(plc.items))
                break
            case PlcType.GROUP:
                plc.children = expandPlcList(plc.items)
                plc.group = true
                ret.push(plc)
                break
            case PlcType.PLC:
                ret.push(plc)
                break
        }

        return ret
    }, [])
}

/**
 * 处理 hide 的列
 * @author  韦胜健
 * @date    2020/4/26 11:03
 */
function processHide(plcList: Plc[]) {
    if (!plcList || plcList.length === 0) {
        return
    }
    for (let i = 0; i < plcList.length; i++) {
        const plc = plcList[i];
        if (plc.actualProps.hide) {
            plcList.splice(i, 1)
            i--
            continue
        }
        if (plc.group) {
            processHide(plc.children)
        }
    }
}

/**
 * 处理 plc 中fixed的列信息，并且根据autoFixedLeft以及autoFixedRight自动调整fixed
 * @author  韦胜健
 * @date    2020/4/26 11:12
 */
function processFixed(plcList: Plc[]): { hasFixedLeft: boolean, hasFixedRight: boolean } {
    const autoFixedLeftPlcList: Plc[] = []
    const autoFixedRightPlcList: Plc[] = []
    let hasFixedLeft = false
    let hasFixedRight = false

    iteratePlcList(plcList, (plc) => {
        if (plc.plcType === PlcType.GROUP) {
            // group 子节点的固定列信息应该与group一直
            plc.children.forEach(child => {
                child.setProps('fixed', plc.props.fixed)
                child.setProps('autoFixedLeft', plc.props.autoFixedLeft)
                child.setProps('autoFixedRight', plc.props.autoFixedRight)
            })
        }

        if (!hasFixedLeft && plc.configProps.fixed === PlcFixedType.left) {
            hasFixedLeft = true
        }
        if (!hasFixedRight && plc.configProps.fixed === PlcFixedType.right) {
            hasFixedRight = true
        }
        if (plc.configProps.autoFixedLeft) {
            autoFixedLeftPlcList.push(plc)
        }
        if (plc.configProps.autoFixedRight) {
            autoFixedRightPlcList.push(plc)
        }
    })

    if (hasFixedLeft) {
        autoFixedLeftPlcList.forEach(plc => plc.actualProps.fixed = PlcFixedType.left)
    }
    if (hasFixedRight) {
        autoFixedRightPlcList.forEach(plc => plc.actualProps.fixed = PlcFixedType.right)
    }

    return {
        hasFixedLeft,
        hasFixedRight,
    }
}

function getPlcOrder(plc: Plc) {
    let order = plc.configProps.order || 1
    if (plc.actualProps.fixed === PlcFixedType.left) {
        order -= 9999
    } else if (plc.actualProps.fixed === PlcFixedType.right) {
        order += 9999
    }
    return order
}

/**
 * 处理plc的order属性，根据order进行排序
 * @author  韦胜健
 * @date    2020/4/26 11:19
 */
function processOrder(plcList: Plc[]) {
    if (!!plcList && plcList.length > 0) {
        PlainUtils.insertSort(plcList, (a: Plc, b: Plc) => {
            const ao = getPlcOrder(a)
            const bo = getPlcOrder(b)
            return ao > bo
        })
        plcList.forEach(plc => {
            if (plc.group) {
                processOrder(plc.children)
            }
        })
    }
}

/**
 * 自动调整plc中的宽度，使得可以填满整个表格的宽度
 * @author  韦胜健
 * @date    2020/4/26 11:22
 */
function processWidth(flatPlcList: Plc[], totalWidth: number) {
    if (flatPlcList.length === 0) return

    // 填充宽度的列
    const fitPlcList: Plc[] = []
    // 填充宽度分配总份数
    let totalFits = 0
    // 剩余的列宽
    let externalWidth = totalWidth

    // console.log('tableWidth', tableWidth)

    flatPlcList.forEach((plc: Plc) => {
        plc.actualProps.width = plc.configProps.width
        externalWidth -= plc.actualProps.width

        if (!!plc.configProps.fit) {
            totalFits += plc.configProps.fit
            fitPlcList.push(plc)
        }
    })
    if (totalFits === 0) {
        totalFits = 1
        fitPlcList.push(flatPlcList[flatPlcList.length - 1])
    }

    if (externalWidth > 0) {
        const fitBlockWidth = Math.floor(externalWidth / totalFits)

        fitPlcList.forEach((fitPlc, index) => {
            if (index === fitPlcList.length - 1) {
                // 如果是最后一个，用完剩下的宽度
                fitPlc.actualProps.width = fitPlc.configProps.width + externalWidth - 1
                externalWidth = 0
            } else {
                // 根据fit分配宽度
                const newWidth = fitPlc.configProps.fit * fitBlockWidth + fitPlc.configProps.width
                fitPlc.actualProps.width = newWidth
                externalWidth -= newWidth
            }
        })
    }
    // console.log(bodyPlcList.reduce((ret, item) => ret + item.actualProps.width, 0))
    // flatPlcList.forEach((plc:Plc) => console.log(plc.title,plc.actualProps.width,plc.configProps.width))
}

export function formatPlcList(originPlcList: Plc[], option: {
    configColumns?: (plcList: Plc[]) => void | null,
    totalWidth: number
}): {
    plcList: Plc[],
    flatPlcList: Plc[],

    hasFixedLeft: boolean,
    hasFixedRight: boolean
} {
    /*---------------------------------------展开 plc list-------------------------------------------*/
    const plcList = expandPlcList(originPlcList)
    /*---------------------------------------从缓存加载plc 配置-------------------------------------------*/
    if (!!option.configColumns) {
        option.configColumns(plcList)
    }
    /*---------------------------------------调整 plc 的各个属性-------------------------------------------*/
    processHide(plcList)
    const {hasFixedLeft, hasFixedRight} = processFixed(plcList)
    processOrder(plcList)

    const flatPlcList = []
    iteratePlcList(plcList, (plc) => !plc.group && flatPlcList.push(plc))
    processWidth(flatPlcList, option.totalWidth)

    return {
        plcList,
        flatPlcList,

        hasFixedLeft,
        hasFixedRight
    }
}

/**
 * 刷新列宽
 * @author  韦胜健
 * @date    2020/4/26 11:25
 */
export function refreshPlcWidth(plcList: Plc[], totalWidth: number) {
    processWidth(plcList, totalWidth)
}