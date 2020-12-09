import {designComponent} from "../../../use/designComponent";
import {DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, DateView, DateViewSeq, Dbpid, SlideTransitionDirection} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PlainDate, PlainDateType} from "../../../utils/PlainDate";
import {computed, Transition, watch} from 'vue';
import {zeroize} from "plain-utils/string/zeroize";

export default designComponent({
    name: 'pl-date-base-panel-date',
    props: {
        ...DatePublicProps,
        view: {type: String, default: DateView.date},
    },
    emits: {
        ...DatePublicEmits,
        updateModelValue: (val?: string, ipd?: PlainDateType) => true,
        clickItem: (ipd: PlainDateType) => true,
        selectTime: (val: string) => true,
        mouseenterItem: (item: Dbpid) => true,
        selectDateChange: (ipd: PlainDateType) => true,
        mouseleaveDateList: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {
            state,
            today,
            tempPd,
            model,
            viewModel,
            getStatus,
            setSelectDate,
            displayFormat,
            valueFormat,
        } = useDate({
            props,
            emit,
            useModelConfig: {
                model: {
                    autoEmit: false,
                    onChange: (val) => !props.selectDate && utils.setSelectDate(val, false)
                },
            },
            jdView: UseDateJudgementView.YMD,
        })

        const utils = {
            /**
             * 设置当前面板的年月
             * @author  韦胜健
             * @date    2020/4/15 10:57
             */
            setSelectDate: (val: string | PlainDateType | undefined, autoEmit = true) => {
                if (!val || typeof val == "string") {
                    tempPd.setValue(val)
                    setSelectDate(tempPd)
                } else {
                    setSelectDate(val)
                }
                if (autoEmit) {
                    emit.selectDateChange(state.selectDate)
                }
            },
            /**
             * 派发值变化事件，先校验值是否大于最大值，小于最小值，是则取最大值（最小值）
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            emitValue(valueString: string) {
                const {max, min} = state.topState
                let vpd = new PlainDate(valueString, displayFormat, valueFormat)
                if (!!max && !max.isNull && (!!props.datetime ? (vpd.YMDHms! > max.YMDHms) : (vpd.YMD! > max.YMD))) {
                    vpd = max
                } else if (!!min && !min.isNull && (!!props.datetime ? (vpd.YMDHms! < min.YMDHms) : (vpd.YMD! < min.YMD))) {
                    vpd = min
                }
                model.value = vpd.valueString!
                emit.updateModelValue(model.value, vpd)
            },
        }

        /*---------------------------------------computer-------------------------------------------*/

        const weekList = computed(() => {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(props.firstWeekDay).concat(weeks.slice(0, props.firstWeekDay))
        })

        const dateList = computed(() => {
            const {selectDate} = state
            tempPd.setYear(selectDate.year!)
            tempPd.setMonthDate(selectDate.month!, 1)
            const currentMonthFirstDate = tempPd.copy()
            let weekDayDuration = currentMonthFirstDate.day! - props.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
            let firstDateTime = new Date(currentMonthFirstDate.time! - (offsetDay) * 24 * 60 * 60 * 1000).getTime()
            let list: Dbpid[] = []
            for (let i = 0; i < 42; i++) {
                const ipd = tempPd.copy()
                ipd.setTime(firstDateTime)
                let item = {
                    ipd,
                    label: ipd.date!,
                    ...getStatus(ipd),
                    isSelectMonth: ipd.YM === selectDate.YM,
                }

                list.push(item)
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        })

        const defaultTimePd = computed(() => {
            const pd = new PlainDate(props.defaultTime, 'HH:mm:ss', 'HH:mm:ss')
            if (pd.isNull) {
                const now = new Date()
                pd.setHms(now.getHours(), now.getMinutes(), now.getSeconds())
            }
            return pd
        })

        /*---------------------------------------attrs-------------------------------------------*/

        const monthAttrs = computed(() => ({
            modelValue: state.selectDate.valueString,
            displayFormat,
            valueFormat,
            view: viewModel.value,
            onChange: handler.onSelectMonthChange,
        }))

        const timeAttrs = computed(() => {

            tempPd.setValue(model.value)
            const vpd = tempPd.copy()
            const timePd = defaultTimePd.value.copy()

            /*此时tempPd存有model.value的时间，如果不为空，则设置时间得model.value的时间*/
            if (!tempPd.isNull) {
                timePd.setHms(tempPd)
            }

            const attrs = {
                modelValue: timePd.valueString,
                displayFormat: 'HH:mm:ss',
                valueFormat: 'HH:mm:ss',
                max: undefined as undefined | string | null,
                min: undefined as undefined | string | null,
                onChange: handler.onSelectTime,
            }

            const {max, min} = state.topState

            if (!!vpd && !vpd.isNull) {
                /*限制最大最小值*/
                if (!!max && !max.isNull) {
                    if (max.YMD <= vpd.YMD) {
                        let tempDefaultTime = timePd.copy()
                        tempDefaultTime.setHms(max)
                        attrs.max = tempDefaultTime.valueString
                    }
                }

                if (!!min && !min.isNull) {
                    if (min.YMD >= vpd.YMD) {
                        let tempDefaultTime = timePd.copy()
                        tempDefaultTime.setHms(min)
                        attrs.min = tempDefaultTime.valueString
                    }
                }
            }

            return attrs

        })

        const showTimePd = computed(() => {
            const value = new PlainDate(model.value, displayFormat, valueFormat)
            return value.isNull ? state.selectDate : value
        })

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            /**
             * 面板切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            prevYear() {
                state.selectDate.setYear(state.selectDate.year! - 1)
                utils.setSelectDate(state.selectDate.copy())
            },
            /**
             * 面板切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            nextYear() {
                state.selectDate.setYear(state.selectDate.year! + 1)
                utils.setSelectDate(state.selectDate.copy())
            },
            /**
             * 面板切换到上一个月份
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            prevMonth() {
                state.selectDate.setMonthDate(state.selectDate.month! - 1, 1)
                utils.setSelectDate(state.selectDate.copy())
            },
            /**
             * 面板切换到下一个月份
             * @author  韦胜健
             * @date    2020/4/15 10:56
             */
            nextMonth() {
                state.selectDate.setMonthDate(state.selectDate.month! + 1, 1)
                utils.setSelectDate(state.selectDate.copy())
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
                state.slide = newSeq > oldSeq ? SlideTransitionDirection.next : SlideTransitionDirection.prev
                viewModel.value = view
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            /**
             * 点击日期元素处理动作
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            onClickItem({ipd}: Dbpid) {
                const defaultTime = defaultTimePd.value
                const vpd = new PlainDate(model.value, displayFormat, valueFormat)
                ipd = ipd.copy()
                if (!vpd.isNull) {
                    ipd!.setHms(vpd)
                } else {
                    ipd!.setHms(defaultTime)
                }

                emit.clickItem(ipd)
                utils.emitValue(ipd.valueString!)
            },
            /**
             * 处理选择时间处理动作
             * @author  韦胜健
             * @date    2020/4/15 10:58
             */
            onSelectTime(val: string) {
                const {selectDate} = state
                const vpd = new PlainDate(model.value, displayFormat, valueFormat)
                const defaultTime = defaultTimePd.value

                const tempPd = defaultTime.copy()
                tempPd.setValue(val)

                if (vpd.isNull) {
                    vpd.setYear(selectDate.year!)
                    vpd.setMonthDate(selectDate.month!, selectDate.date!)
                }

                vpd.setHms(tempPd)

                utils.emitValue(vpd.valueString!)
                emit.selectTime(val)
            },
            /**
             * 月份选择面板的值发生变化之后，改变视图
             * @author  韦胜健
             * @date    2020/4/15 10:59
             */
            onSelectMonthChange(val: string) {
                state.selectDate.setValue(val)
                utils.setSelectDate(state.selectDate.copy())
                methods.changeView(DateView.date)
            },
        }

        watch(() => props.selectDate, (val) => state.selectDate = val || today.copy())

        const render = {
            date: () => {
                const Wrapper: any = DatePanelWrapper({
                    left: (<>
                        <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={methods.prevYear}/>
                        <pl-button icon="el-icon-arrow-left" mode="text" size="mini" onClick={methods.prevMonth}/>
                    </>),
                    center: (<>
                        <span onClick={() => methods.changeView(DateView.year)}>{state.selectDate.year}</span>
                        -
                        <span onClick={() => methods.changeView(DateView.month)}>{zeroize(state.selectDate.month! + 1)}</span>
                        {!!props.datetime && (<span class="pl-date-base-panel-date-time-label" onClick={() => methods.changeView(DateView.time)}>
                        {timeAttrs.value.modelValue}
                    </span>)}
                    </>),
                    right: (<>
                        <pl-button icon="el-icon-arrow-right" mode="text" size="mini" onClick={methods.nextMonth}/>
                        <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={methods.nextYear}/>
                    </>),
                    content: (<>
                        <ul class="pl-date-base-panel-date-week-list">
                            {weekList.value.map(item => (
                                <li class="pl-date-base-panel-item pl-date-base-panel-date-week-item" key={item}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <pl-list class="pl-date-base-panel-date-list" tag="ul" onMouseleave={emit.mouseleaveDateList}>
                            {dateList.value.map((item, index) => (
                                DatePanelItemWrapper({
                                    item,
                                    onClick: handler.onClickItem,
                                    onMouseenter: emit.mouseenterItem,
                                    Node: <pl-item
                                        {...{
                                            tag: 'li',
                                            class: ['pl-date-base-panel-date-item', {'pl-date-base-panel-date-item-other-month': !item.isSelectMonth,}],
                                            key: item.isSelectMonth ? item.ipd!.date : `_${index}`,
                                        }}
                                    />,
                                })
                            ))}
                        </pl-list>
                    </>),
                })
                return <Wrapper {...{class: 'pl-date-base-panel-date', direction: 'horizontal', key: 'date'}}/>
            },
            month: () => {
                return <pl-date-base-panel-month {...monthAttrs.value} direction="horizontal" key={viewModel.value}/>
            },
            time: () => {
                const Wrapper: any = DatePanelWrapper({
                    center: (<><span onClick={() => methods.changeView(DateView.date)}>
                                {showTimePd.value.year}-{zeroize(showTimePd.value.month! + 1)}-{zeroize(showTimePd.value.date!)}
                            </span></>),
                    content: <pl-time-panel {...timeAttrs.value}/>,
                })
                return <Wrapper {...{class: 'pl-date-base-panel-time', direction: 'horizontal', key: 'time'}}/>
            },
        }

        return {
            render: () => (
                <div class="pl-date-base-panel-date-wrapper pl-date-base-panel">
                    <Transition name={`pl-transition-slide-${state.slide}`}>
                        {render[viewModel.value === DateView.year ? DateView.month : viewModel.value]()}
                    </Transition>
                </div>
            )
        }
    },
})