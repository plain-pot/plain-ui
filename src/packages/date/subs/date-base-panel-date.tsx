import {computed, defineComponent, watch} from "@vue/composition-api";
import {DateBasePanelItemData, DatePublicProps, DateView, DateViewSeq, PanelItemParam} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {PlainDate} from "@/util/PlainDate";
import {useDate} from "@/packages/date/useDate";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-date-base-panel-date',
    props: {
        ...DatePublicProps,

        dateListBinding: {type: Object},
        view: {type: String, default: DateView.date},
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string, vpd: PlainDate) => undefined,
            clickItem: EmitFunc,
            selectTime: EmitFunc,
            mouseenterItem: EmitFunc,
            selectDateChange: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const {
            state,
            targetPanelItemParam,
            panelItemParam,
            firstDatePanel,
            setSelectDate,
            model,
            viewModel,
            displayFormat,
            valueFormat,
        } = useDate({
            props,
            injectView: DateView.date,

            modelAutoEmit: false,
            startModelAutoEmit: false,
            endModelAutoEmit: false,

            getProvideData(panelItemParam) {
                const {value, hoverRange, valueRange} = panelItemParam
                return {
                    year: {
                        range: false,
                        value,
                        hoverRange,
                        valueRange,
                    },
                    month: {
                        range: false,
                        value,
                        hoverRange,
                        valueRange,
                    },
                }
            },

            onModelChange(val) {
                model.value = val
                if (!props.selectDate) {
                    utils.setSelectDate(val, false)
                }
            },
        })

        /*---------------------------------------computer-------------------------------------------*/

        const weekList = computed(() => {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(props.firstWeekDay).concat(weeks.slice(0, props.firstWeekDay))
        })

        const dateList = computed(() => {
            const {today, selectDate, tempPd} = state

            tempPd.setYear(selectDate.year)
            tempPd.setMonthDate(selectDate.month, 1)

            const currentMonthFirstDate = tempPd.copy()

            let weekDayDuration = currentMonthFirstDate.day - props.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let firstDateTime = new Date(currentMonthFirstDate.time - (offsetDay) * 24 * 60 * 60 * 1000).getTime()

            const panelItemParam = targetPanelItemParam.value
            const {range} = panelItemParam

            let list: DateBasePanelItemData[] = []
            for (let i = 0; i < 42; i++) {

                const ipd = tempPd.copy()
                ipd.setTime(firstDateTime)

                let item = {
                    label: ipd.date,
                    now: today.YMD === ipd.YMD,
                    disabled: utils.getDisabled(ipd, panelItemParam),
                    active: utils.getActive(ipd, panelItemParam),

                    hover: false,
                    hoverStart: false,
                    hoverEnd: false,

                    range,
                    ipd,
                    isSelectMonth: ipd.YM === selectDate.YM,
                }

                if (range) {
                    item.hoverStart = utils.getHoverStart(ipd, panelItemParam)
                    item.hover = utils.getHover(ipd, panelItemParam)
                    item.hoverEnd = utils.getHoverEnd(ipd, panelItemParam)
                }

                list.push(item)
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        })

        const defaultTimePd = computed(() => {
            return new PlainDate(props.defaultTime || '12:00:00', 'HH:mm:ss', 'HH:mm:ss')
        })

        const monthPanelBinding = computed(() => {
            const {selectDate} = state
            return {
                props: {
                    value: selectDate.valueString,
                    displayFormat: displayFormat.value,
                    valueFormat: valueFormat.value,
                    view: viewModel.value,
                },
                on: {
                    change: handler.onSelectMonthChange,
                },
            }
        })

        const timePanelBinding = computed(() => {
            const {value, max, min} = panelItemParam.value

            const defaultTime = defaultTimePd.value

            const timePd = value.isNull ? defaultTime : value
            const timeString = defaultTime.format(timePd.dateObject)

            const props = {
                value: timeString,
                displayFormat: 'HH:mm:ss',
                valueFormat: 'HH:mm:ss',
                max: undefined as undefined | string | null,
                min: undefined as undefined | string | null,
            }

            /*限制最大最小值*/
            if (!max.isNull && !value.isNull) {
                if (max.YMD <= value.YMD) {
                    let tempDefaultTime = defaultTime.copy()
                    tempDefaultTime.setHms(max)
                    props.max = tempDefaultTime.valueString
                }
            }

            if (!min.isNull && !value.isNull) {
                if (min.YMD >= value.YMD) {
                    let tempDefaultTime = defaultTime.copy()
                    tempDefaultTime.setHms(min)
                    props.min = tempDefaultTime.valueString
                }
            }

            return {
                props,
                on: {
                    change: (val) => {
                        handler.onSelectTime(val)
                    },
                },
            }
        })

        const showTimePd = computed(() => {
            const value = panelItemParam.value.value as PlainDate
            return value.isNull ? state.selectDate : value
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 设置当前面板的年月
             * @author  韦胜健
             * @date    2020/4/15 10:57
             */
            setSelectDate(val: string | PlainDate | undefined, emitEvent: boolean = true) {
                if (typeof val === 'string') {
                    val = (!!val ? new PlainDate(val, displayFormat.value, valueFormat.value) : state.today)
                }
                state.selectDate = val || state.today
                if (emitEvent) {
                    emit.selectDateChange(state.selectDate)
                }
            },
            /**
             * 派发值变化事件，先校验值是否大于最大值，小于最小值，是则取最大值（最小值）
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            emitValue(valueString) {
                const {max, min} = panelItemParam.value

                let vpd = new PlainDate(valueString, displayFormat.value, valueFormat.value)
                if (!max.isNull && (!!props.datetime ? (vpd.YMDHms! > max.YMDHms) : (vpd.YMD! > max.YMD))) {
                    vpd = max
                } else if (!min.isNull && (!!props.datetime ? (vpd.YMDHms! < min.YMDHms) : (vpd.YMD! < min.YMD))) {
                    vpd = min
                }

                model.value = vpd.valueString
                emit.input(model.value, vpd)
            },

            /**
             * 判断日期是否禁用
             * @author  韦胜健
             * @date    2020/4/15 10:57
             */
            getDisabled(ipd: PlainDate, {max, min}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildDisabled) {
                    return firstDatePanel.value.getChildDisabled(ipd, DateView.date)
                }
                if (!!max && !max.isNull && max.YMD! < ipd.YMD!) return true
                if (!!min && !min.isNull && min.YMD! > ipd.YMD!) return true
                return false
            },
            getActive(ipd: PlainDate, {range, value, valueRange: [start, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildActive) {
                    return firstDatePanel.value!.getChildActive(ipd, DateView.date)
                }
                if (!range) {
                    if (!Array.isArray(value)) {
                        value = [value] as PlainDate[]
                    }
                    return value.some(iv => (!iv.isNull && iv.YMD === ipd.YMD))
                } else {
                    return ((!start.isNull && start.YMD === ipd.YMD) || (!end.isNull && end.YMD === ipd.YMD))
                }
            },
            getHoverStart(ipd: PlainDate, {hoverRange, valueRange: [start]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHoverStart) {
                    return firstDatePanel.value!.getChildHoverStart(ipd, DateView.date)
                }
                return !!hoverRange ? hoverRange[0].YMD === ipd.YMD : (!start.isNull && start.YMD === ipd.YMD)
            },
            getHover(ipd: PlainDate, {hoverRange, valueRange: [start, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHover) {
                    return firstDatePanel.value!.getChildHover(ipd, DateView.date)
                }
                return !!hoverRange ? hoverRange[0].YMD! < ipd.YMD! && hoverRange[1].YMD! > ipd.YMD! :
                    (!start.isNull && !end.isNull) && (start.YMD! < ipd.YMD! && end.YMD! > ipd.YMD!)
            },
            getHoverEnd(ipd: PlainDate, {hoverRange, valueRange: [, end]}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value.getChildHoverEnd) {
                    return firstDatePanel.value.getChildHoverEnd(ipd, DateView.date)
                }
                return !!hoverRange ? hoverRange[1].YMD === ipd.YMD : (!end.isNull && end.YMD === ipd.YMD)
            },
        }

        const methods = {
            /**
             * 面板切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            prevYear() {
                state.selectDate.setYear(state.selectDate.year - 1)
                setSelectDate(state.selectDate)
            },
            /**
             * 面板切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            nextYear() {
                state.selectDate.setYear(state.selectDate.year + 1)
                setSelectDate(state.selectDate)
            },
            /**
             * 面板切换到上一个月份
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            prevMonth() {
                state.selectDate.setMonthDate(state.selectDate.month - 1, 1)
                setSelectDate(state.selectDate.copy())
            },
            /**
             * 面板切换到下一个月份
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            nextMonth() {
                state.selectDate.setMonthDate(state.selectDate.month + 1, 1)
                setSelectDate(state.selectDate.copy())
            },
            /**
             * 切换视图，确定动画方向
             * @author  韦胜健
             * @date    2020/4/15 10:57
             */
            changeView(view: DateView) {
                if (view === viewModel.value) return
                const oldSeq = DateViewSeq[viewModel.value]
                const newSeq = DateViewSeq[view]
                state.transitionDirection = newSeq > oldSeq ? 'next' : 'prev'
                viewModel.value = view
            },
        }

        const handler = {
            /**
             * 点击日期元素处理动作
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            onClickItem({ipd}: DateBasePanelItemData) {
                const {value} = panelItemParam.value
                const defaultTime = defaultTimePd.value

                if (!value.isNull) {
                    ipd!.setHms(value)
                } else {
                    ipd!.setHms(defaultTime)
                }

                emit.clickItem(ipd)
                utils.emitValue(ipd!.valueString)
            },
            /**
             * 处理选择时间处理动作
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            onSelectTime(val) {
                const {selectDate} = state
                const {value} = panelItemParam.value
                const defaultTime = defaultTimePd.value

                const tempPd = defaultTime.copy()
                tempPd.setValue(val)

                if (value.isNull) {
                    value.setYear(selectDate.year)
                    value.setMonthDate(selectDate.month, selectDate.date)
                }

                value.setHms(tempPd)

                utils.emitValue(value.valueString)
                emit.selectTime(val)
            },
            /**
             * 月份选择面板的值发生变化之后，改变视图
             * @author  韦胜健
             * @date    2020/4/15 10:59
             */
            onSelectMonthChange(val) {
                state.selectDate.setValue(val)
                utils.setSelectDate(state.selectDate.copy())
                methods.changeView(DateView.date)
            },
        }

        watch(() => props.selectDate, (val) => {
            state.selectDate = val || state.today
        }, {lazy: true})

        return () => (
            <div class="pl-date-base-panel-date-wrapper pl-date-base-panel" onMousedown={emit.mousedownPanel}>
                <transition name={`pl-transition-slide-${state.transitionDirection}`}>
                    {{
                        date: (
                            <pl-date-base-panel class="pl-date-base-panel-date" direction="horizontal" key="date">
                                <template slot="left">
                                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={methods.prevYear}/>
                                    <pl-button icon="el-icon-arrow-left" mode="text" size="mini" onClick={methods.prevMonth}/>
                                </template>
                                <template slot="center">
                                    <span onclick={() => methods.changeView(DateView.year)}>{state.selectDate.year}</span>
                                    -
                                    <span onclick={() => methods.changeView(DateView.month)}>{$plain.utils.zeroize(state.selectDate.month + 1)}</span>
                                    {!!props.datetime && (
                                        <span class="pl-date-base-panel-date-time-label" onclick={() => methods.changeView(DateView.time)}>
                                            {timePanelBinding.value.props.value}
                                        </span>
                                    )}
                                </template>
                                <template slot="right">
                                    <pl-button icon="el-icon-arrow-right" mode="text" size="mini" onClick={methods.nextMonth}/>
                                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={methods.nextYear}/>
                                </template>

                                <template slot="content">
                                    <ul class="pl-date-base-panel-date-week-list">
                                        {weekList.value.map(item => (
                                            <pl-date-base-panel-item key={item} class="pl-date-base-panel-date-week-item" item={{label: item,}}/>
                                        ))}
                                    </ul>
                                    <pl-list class="pl-date-base-panel-date-list" tag="ul" {...(props.dateListBinding || {})}>
                                        {dateList.value.map((item: DateBasePanelItemData, index) => (
                                            <pl-date-base-panel-item
                                                component="pl-item"
                                                componentProps={{tag: 'li'}}
                                                class={[
                                                    'pl-date-base-panel-date-item',
                                                    {
                                                        'pl-date-base-panel-date-item-other-month': !item.isSelectMonth,
                                                    }
                                                ]}
                                                item={item}
                                                nativeListener
                                                onClick={handler.onClickItem}
                                                onMouseenter={emit.mouseenterItem}
                                                key={item.isSelectMonth ? item.ipd!.date : `_${index}`}
                                            />
                                        ))}
                                    </pl-list>
                                </template>
                            </pl-date-base-panel>
                        ),
                        month: (
                            <pl-date-base-panel-month {...monthPanelBinding.value} direction="horizontal" key={viewModel.value}/>
                        ),
                        time: (
                            <pl-date-base-panel class="pl-date-base-panel-time" direction="horizontal" key="time">
                                <template slot="center">
                                    <span onclick={() => methods.changeView(DateView.date)}>
                                        {showTimePd.value.year}
                                        -
                                        {$plain.utils.zeroize(showTimePd.value.month + 1)}
                                        -
                                        {$plain.utils.zeroize(showTimePd.value.date)}
                                    </span>
                                </template>
                                <template slot="content">
                                    <pl-time-panel {...timePanelBinding.value}/>
                                </template>
                            </pl-date-base-panel>
                        )
                    }[viewModel.value === 'year' ? 'month' : viewModel.value]}
                </transition>
            </div>
        )
    }
})