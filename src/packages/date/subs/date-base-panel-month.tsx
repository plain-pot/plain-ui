import {computed, defineComponent} from "@vue/composition-api";
import {DateBasePanelItemData, DateEmitInputType, DatePublicProps, DateView, DefaultFormatString, PanelItemParam, SlideTransitionDirection} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useDate} from "@/packages/date/useDate";
import {PlainDate} from "@/util/PlainDate";

export default defineComponent({
    name: 'pl-date-base-panel-month',
    props: {
        ...DatePublicProps,

        displayFormat: {type: String, default: DefaultFormatString.month},
        valueFormat: {type: String, default: DefaultFormatString.month},
        view: {type: String, default: DateView.month},
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string, type: DateEmitInputType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const months = computed(() => ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',])

        const {state, targetPanelItemParam, firstDatePanel, setSelectDate, value, start, end, view} = useDate({
            props,
            injectView: DateView.month,
            getProvideData: (panelItemParam) => {
                const {value, hoverRange, valueRange, range} = panelItemParam
                return {
                    year: {
                        range,
                        value: value,
                        hoverRange,
                        valueRange,
                    }
                }
            },
        })

        const monthList = computed(() => {
            const {selectDate, today, tempPd} = state

            const panelItemParam = targetPanelItemParam.value
            const {range} = panelItemParam


            let ret: DateBasePanelItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {

                tempPd.setYear(selectDate.year)
                tempPd.setMonthDate(i, 1)
                const ipd = tempPd.copy()

                const item = {
                    label: months.value[i],
                    now: today.YM === ipd.YM,

                    disabled: utils.getDisabled(ipd, panelItemParam),
                    active: utils.getActive(ipd, panelItemParam),
                    hoverStart: false,
                    hoverEnd: false,
                    hover: false,

                    range,
                    month: i,
                    ipd,
                }

                if (range || (!!firstDatePanel.value && !!firstDatePanel.value!.props.range)) {
                    item.hoverStart = utils.getHoverStart(ipd, panelItemParam)
                    item.hoverEnd = utils.getHoverEnd(ipd, panelItemParam)
                    item.hover = utils.getHover(ipd, panelItemParam)
                }

                ret.push(item)
            })
            return ret
        })

        const utils = {
            /**
             * 检查需要禁用的月份
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            getDisabled(ipd: PlainDate, {max, min}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildDisabled) {
                    return firstDatePanel.value!.getChildDisabled(ipd, DateView.month)
                }
                if (!!max && !max.isNull && max.YM! < ipd.YM!) return true
                if (!!min && !min.isNull && min.YM! > ipd.YM!) return true
                return false
            },
            /**
             * 检查当前需要激活的月份
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            getActive(ipd: PlainDate, {range, value, valueRange: [start, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildActive) {
                    return firstDatePanel.value!.getChildActive(ipd, DateView.month)
                }
                if (!range) {
                    if (!Array.isArray(value)) {
                        value = [value] as PlainDate[]
                    }
                    return value.some(iv => (!iv.isNull && iv.YM === ipd.YM))
                } else {
                    return ((!start.isNull && start.YM === ipd.YM) || (!end.isNull && end.YM === ipd.YM))
                }
            },
            getHoverStart(ipd: PlainDate, {hoverRange, valueRange: [start]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHoverStart) {
                    return firstDatePanel.value!.getChildHoverStart(ipd, DateView.month)
                }
                return !!hoverRange ? hoverRange[0].YM === ipd.YM : (!start.isNull && start.YM === ipd.YM)
            },
            getHover(ipd: PlainDate, {hoverRange, valueRange: [start, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHover) {
                    return firstDatePanel.value!.getChildHover(ipd, DateView.month)
                }
                return !!hoverRange ? hoverRange[0].YM! < ipd.YM! && hoverRange[1].YM! > ipd.YM! :
                    (!start.isNull && !end.isNull) && (start.YM! < ipd.YM! && end.YM! > ipd.YM!)
            },
            getHoverEnd(ipd: PlainDate, {hoverRange, valueRange: [, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHoverEnd) {
                    return firstDatePanel.value!.getChildHoverEnd(ipd, DateView.month)
                }
                return !!hoverRange ? hoverRange[1].YM === ipd.YM : (!end.isNull && end.YM === ipd.YM)
            },
        }

        const methods = {
            /**
             * 设置当前选择的年份
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            setSelectYear(target: number) {
                if (!target) {
                    target = state.today.year
                }
                state.transitionDirection = state.selectDate.year > target ? SlideTransitionDirection.prev : SlideTransitionDirection.next
                state.selectDate.setYear(target)
                setSelectDate(state.selectDate)
            },
            /**
             * 切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            prevYear() {
                state.transitionDirection = SlideTransitionDirection.prev
                state.selectDate.setYear(state.selectDate.year - 1)
                setSelectDate(state.selectDate)
            },
            /**
             * 切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            nextYear() {
                state.transitionDirection = SlideTransitionDirection.next
                state.selectDate.setYear(state.selectDate.year + 1)
                setSelectDate(state.selectDate)
            },
        }

        const handler = {
            /**
             * 处理点击月份元素的动作
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            onClickItem(item) {

                const temp = state.selectDate.copy()
                temp.setMonthDate(item.month, 1)

                if (!props.range) {
                    value.value = temp.valueString
                } else {

                    if (!state.hoverRange) {

                        temp.setMonthDate(item.month, 1)
                        state.hoverRange = [temp, temp]
                        state.hoverRange = [temp, temp]

                    } else {
                        const [startPd, endPd] = state.hoverRange

                        start.value = startPd.valueString
                        end.value = endPd.valueString

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.input(start.value, DateEmitInputType.start)
                        emit.input(end.value, DateEmitInputType.end)
                    }
                }
            },
            /**
             * 处理鼠标进入月份元素的动作
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            onMouseEnterItem(item) {
                if (!!start.hoverRange) {
                    let midPd = start.valueRange[0]
                    const temp = state.selectDate.copy()
                    temp.setMonthDate(item.month, 1)
                    state.hoverRange = midPd.YM > temp.YM ? [temp, midPd] : [midPd, temp]
                }
            },
            /**
             * 处理年份面板选择年份变化动作
             * @author  韦胜健
             * @date    2020/4/15 11:14
             */
            onSelectYearChange(val) {
                view.value = DateView.month
                state.selectDate.setYear(val)
                setSelectDate(state.selectDate)
            },
        }


    },
})