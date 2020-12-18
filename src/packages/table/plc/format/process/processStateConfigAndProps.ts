import {TablePlc} from "../../core/plc.type";
import {TablePlcFixedType, TablePropsConfig} from "../../../core/table.utils";
import {IteratePlcHandleType, iteratePlcList} from "../utils/iteratePlcList";

/**
 * 处理Plc以及PlcGroup公共的，逻辑
 * @author  韦胜健
 * @date    2020/12/18 11:18
 */
function handleTablePlc(plc: TablePlc, configData: { [k: string]: any } | null) {
    const props = plc.props as any
    const state = plc.state as any
    // 如果有config，将config中的属性覆盖props
    const configPlc = !configData ? null : configData[`${!plc.group ? plc.props.field : 'group'}_${plc.props.title}`]
    if (!!configPlc) {
        Object.keys(configPlc).forEach(key => {
            if (configPlc[key] != null) props[key] = configPlc[key]
        })
    }
    // 如果有state，将state中的属性覆盖props
    Object.keys(plc.state).forEach(key => {
        if (state[key] != null) props[key] = state[key]
    })
}

/**
 * 处理plc的数据，以state、config、props为顺序，优先级依次递减，
 * 得到一个最终的plc.props 对象
 * @author  韦胜健
 * @date    2020/12/18 11:08
 */
export function processStateConfigAndProps(
    {
        plcList,
        config,
    }: {
        plcList: TablePlc[],
        config?: TablePropsConfig,
    }
) {
    const configData = !config ? null : config(plcList)

    const configState = {
        notFitVirtual: [] as TablePlc[],                        // 不能使用虚拟滚动的列
        fixedLeft: [] as TablePlc[],                            // 左固定的列
        fixedRight: [] as TablePlc[],                           // 右固定的列
        autoFixedLeft: [] as TablePlc[],                        // 需要自动左固定的列
        autoFixedRight: [] as TablePlc[],                       // 需要自动右固定的列
    }

    /**
     * - 根基plc的config，计算plc的属性。
     * - 计算出需要自动左固定的plc，自动右固定的plc，左固定的plc，右固定的plc；以及计算出不兼容虚拟滚动的plc；
     * - 如果group设置了自动左右固定或者左右固定，那么他的子组件plc或者group也要改成和父group一致的值；
     * - 将隐藏的plc从group的子节点数据中移除
     * @author  韦胜健
     * @date    2020/8/12 10:24
     */
    iteratePlcList({
        plcList,
        onPlc: plc => {
            handleTablePlc(plc, configData)
            // 如果是隐藏的列，则删除这一列
            if (plc.props.hide) {
                return IteratePlcHandleType.remove
            }
            if (plc.props.notFitVirtual) configState.notFitVirtual.push(plc)
            if (plc.props.autoFixedLeft) configState.autoFixedLeft.push(plc)
            if (plc.props.autoFixedRight) configState.autoFixedRight.push(plc)
            if (plc.props.fixed === TablePlcFixedType.left) configState.fixedLeft.push(plc)
            if (plc.props.fixed === TablePlcFixedType.right) configState.fixedRight.push(plc)
            return IteratePlcHandleType.nothing
        },
        onGroup: group => {
            handleTablePlc(group, configData)
            if (group.props.hide) {
                return IteratePlcHandleType.remove
            }
            // 表头分组，子节点的固定方式，以及左固定、右固定随父节点控制
            group.children.forEach(plc => {
                plc.props.fixed = group.props.fixed
                plc.props.autoFixedLeft = group.props.autoFixedLeft
                plc.props.autoFixedRight = group.props.autoFixedRight
            })
            return IteratePlcHandleType.nothing
        },
    })

    /**
     * 在最终排序的时候，要求fixed是正确的，而跟autoFixedLeft，autoFixedRight的值无关
     * @author  韦胜健
     * @date    2020/12/18 11:26
     */

    /*如果存在左固定列，则设置autoFixedLeft为左固定*/
    if (configState.fixedLeft.length > 0) {configState.autoFixedLeft.forEach(plc => plc.props.fixed = TablePlcFixedType.left)}

    /*如果存在右固定列，则设置autoFixedRight为右固定*/
    if (configState.fixedRight.length > 0) {configState.autoFixedRight.forEach(plc => plc.props.fixed = TablePlcFixedType.right)}

    return configState
}