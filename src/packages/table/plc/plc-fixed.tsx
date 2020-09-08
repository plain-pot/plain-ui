import {PlcType} from "@/packages/table/plc/plc";
import {isPlcGroup, PlcGroupType} from "@/packages/table/plc/plc-group";
import {StyleType} from "@/types/utils";
import {PlcFixedType, stickyFlag} from "@/packages/table/plc/plc-utils";
import {computed, reactive, watch} from "@vue/composition-api";
import {PlainScroll} from "@/packages/scroll/scroll";

/**
 * 根据plc.props.fixed
 * 获取单元格td的固定样式
 * @author  韦胜健
 * @date    2020/8/14 17:06
 */
export function getCellStyles(plc: PlcType | PlcGroupType, adjust: (styles: StyleType) => StyleType) {

    // if (plc.props.fixed === PlcFixedType.center || !stickyFlag) {
    if (plc.props.fixed === PlcFixedType.center) {
        return adjust({})
    }

    const ret = {} as StyleType
    ret.position = 'sticky'
    ret.zIndex = '3'

    if (!isPlcGroup(plc)) {
        ret[plc.props.fixed] = plc.fixedPosition[plc.props.fixed] + 'px'
    } else {
        let count = 10
        const fixedLeft = plc.props.fixed === PlcFixedType.left
        while (!!plc && isPlcGroup(plc) && count > 0) {
            plc = plc.items.value[fixedLeft ? 0 : plc.items.value.length - 1]
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
            case PlcFixedType.left:
                ret.left.push(item)
                break
            case PlcFixedType.right:
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

    Object.keys(collector).forEach(key => {
        let list = collector[key]!
        if (key === 'right') {
            list = list.reverse()
        }

        for (let i = 0; i < list.length; i++) {
            const element = list[i] as PlcType;
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
 * 获取table的fixed class，当滚动做左侧的时候，不显示左阴影。同理右侧也是；
 * @author  韦胜健
 * @date    2020/8/17 20:58
 */
export function useFixedShadow(bodyScrollRef: () => PlainScroll) {
    const state = reactive({
        showFixedLeft: false,
        showFixedRight: false,
    })

    watch(() => {
        if (!bodyScrollRef()) {
            return null
        }
        const {wrapperScrollLeft, hostWidth} = bodyScrollRef().state
        return `${wrapperScrollLeft}_${hostWidth}`
    }, (val: string | null) => {
        if (!val) {
            state.showFixedLeft = false
            state.showFixedRight = false
        } else {
            const {hostWidth, contentWidth, wrapperScrollLeft} = bodyScrollRef().state
            state.showFixedLeft = contentWidth > hostWidth && wrapperScrollLeft > 0
            state.showFixedRight = contentWidth > hostWidth && Math.abs(wrapperScrollLeft + hostWidth - contentWidth) > 5
        }
    })

    const classes = computed(() => [
        {
            'plt-table-hide-fixed-left': !state.showFixedLeft,
            'plt-table-hide-fixed-right': !state.showFixedRight,
        }
    ])

    return {
        fixedShadowClass: classes,
    }
}