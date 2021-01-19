import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, DateView, DateViewSeq, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {computed, PropType, Transition, watch} from 'vue';
import {PDate, plainDate} from "../plainDate";
import {PlButton} from "../../button/button";
import {StyleSize} from "../../../use/useStyle";
import {prefix} from "../../../utils/prefix";
import {PlList} from "../../list/list";
import {createEventListener} from "../../../utils/createEventListener";
import {PlItem} from "../../item/item";
import {zeroize} from "plain-utils/string/zeroize";
import {PlDatePanelMonth} from "./date-panel-month";
import {PlTimePanel} from "../../time/panel/time-panel";

export const PlDatePanelDate = designComponent({
    name: 'pl-date-panel-date',
    props: {
        ...DatePublicProps,
        view: {type: String as PropType<DateView>, default: DateView.date},
    },
    emits: {
        ...DatePublicEmits,
        // onUpdateModelValue: (val?: string, ipd?: PDate) => true,
        onClick: (did: DateItemData) => true,
        onMouseenter: (did: DateItemData) => true,
        onSelectTime: (val: string) => true,
        onSelectDateChange: (pd: PDate) => true,
        onMouseleaveDateList: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {
            model,
            state,
            today,
            getStatus,
            displayFormat,
            valueFormat,
            viewModel,
            setSelectDate,
            handler,
            parent,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YMD,
            processPd: {
                value: (pd) => {
                    if (!props.datetime) return pd
                    pd = pd.useHms(showTimePd.value)
                    if (!!state.topState.max && state.topState.max.YMDHms < pd.YMDHms) {pd = state.topState.max}
                    if (!!state.topState.min && state.topState.min.YMDHms > pd.YMDHms) {pd = state.topState.min}
                    return pd
                }
            },
        })

        const utils = {
            setSelectDate: (val: PDate | string | undefined, autoEmit = true) => {
                let pd: PDate;
                if (!val) {
                    pd = today
                } else {
                    pd = typeof val !== "string" ? val : today.useValue(val)
                }
                setSelectDate(pd)
                if (autoEmit) {
                    emit.onSelectDateChange(pd)
                }
            }
        }

        const weekList = computed(() => {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(props.firstWeekDay).concat(weeks.slice(0, props.firstWeekDay))
        })

        const dateList = computed(() => {
            const {selectDate} = state
            let pd = today.useYMD([selectDate.year, selectDate.month, 1])
            const currentMonthFirstDate = pd.clone()
            let weekDayDuration = currentMonthFirstDate.day - props.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
            let firstDateTime = new Date(currentMonthFirstDate.time! - (offsetDay) * 24 * 60 * 60 * 1000).getTime()
            let list: DateItemData[] = []
            for (let i = 0; i < 42; i++) {
                pd = pd.useTime(firstDateTime)
                let item = {
                    label: pd.date,
                    pd,
                    ...getStatus(pd),
                    externals: {
                        isSelectMonth: pd.YM === selectDate.YM,
                    },
                }
                list.push(item)
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        })

        const monthAttrs = computed(() => ({
            modelValue: state.selectDate.getValue(),
            displayFormat,
            valueFormat,
            view: viewModel.value,
            onChange: externalHandler.onSelectMonthChange,
        }))

        const defaultTimePd = computed(() => {
            const config = {displayFormat: DefaultDateFormatString.Hms, valueFormat: DefaultDateFormatString.Hms}
            return !!props.defaultTime ?
                plainDate(props.defaultTime, config) :
                plainDate.today(config.displayFormat, config.valueFormat)
        })

        const showTimePd = computed(() => (state.pd.vpd as PDate | null) || defaultTimePd.value)

        const timeAttrs = computed(() => {
            const vpd = state.pd.vpd as PDate | null
            const timePd = vpd || defaultTimePd.value
            const attrs = {
                modelValue: plainDate.format(timePd.getDate(), DefaultDateFormatString.Hms),
                displayFormat: DefaultDateFormatString.Hms,
                valueFormat: DefaultDateFormatString.Hms,
                max: undefined as undefined | string,
                min: undefined as undefined | string,
                onChange: externalHandler.onSelectTime,
            }
            const {max, min} = state.topState
            if (!!vpd) {
                /*限制最大最小值*/
                if (!!max) {
                    if (max.YMD <= vpd.YMD) {
                        const maxPd = timePd.useHms(max)
                        attrs.max = plainDate.format(maxPd.getDate(), DefaultDateFormatString.Hms)
                    }
                }
                if (!!min) {
                    if (min.YMD >= vpd.YMD) {
                        const minPd = timePd.useHms(min)
                        attrs.min = plainDate.format(minPd.getDate(), DefaultDateFormatString.Hms)
                    }
                }
            }
            return attrs
        })

        const methods = {
            /*上一年*/
            prevYear() {utils.setSelectDate(state.selectDate.useYear(state.selectDate.year - 1))},
            /*下一年*/
            nextYear() {utils.setSelectDate(state.selectDate.useYear(state.selectDate.year + 1))},
            /*上一月*/
            prevMonth() {utils.setSelectDate(state.selectDate.useMonthDate(state.selectDate.month - 1, 1))},
            /*下一月*/
            nextMonth() {utils.setSelectDate(state.selectDate.useMonthDate(state.selectDate.month + 1, 1))},
            /*切换视图*/
            changeView: (view: DateView) => {
                if (view === viewModel.value) return
                const oldSeq = DateViewSeq[viewModel.value]
                const newSeq = DateViewSeq[view]
                state.slide = newSeq > oldSeq ? SlideTransitionDirection.next : SlideTransitionDirection.prev
                viewModel.value = view
            },
        }

        const externalHandler = {
            onSelectMonthChange: (val: string) => {
                utils.setSelectDate(state.selectDate.useValue(val))
                methods.changeView(DateView.date)
            },
            onSelectTime: (val: string) => {
                if (!!parent) {return emit.onSelectTime(val)}
                const timePd = defaultTimePd.value.useValue(val)
                let vpd = state.pd.vpd as PDate | undefined || today
                vpd = vpd.useHms(timePd)
                model.value = vpd.getValue()
                emit.onSelectTime(val)
            },
            onClick: (did: DateItemData) => {
                if (!!parent) {return emit.onClick(did)}
                handler.onClick(did)
            },
            onMouseenter: (did: DateItemData) => {
                if (!!parent) {return emit.onMouseenter(did)}
                handler.onMouseenter(did)
            },
        }

        watch(() => props.selectDate, (val) => state.selectDate = val || today)

        const render = {
            date: () => {
                const Wrapper: any = DatePanelWrapper({
                    left: (<>
                        <PlButton icon="el-icon-d-arrow-left" mode="text" size={StyleSize.mini} onClick={methods.prevYear}/>
                        <PlButton icon="el-icon-arrow-left" mode="text" size={StyleSize.mini} onClick={methods.prevMonth}/>
                    </>),
                    center: (<>
                        <span onClick={() => methods.changeView(DateView.year)}>{state.selectDate.year}</span>
                        -
                        <span onClick={() => methods.changeView(DateView.month)}>{prefix(state.selectDate.month! + 1)}</span>
                        {!!props.datetime && (<span class="pl-date-base-panel-date-time-label" onClick={() => methods.changeView(DateView.time)}>
                        {timeAttrs.value.modelValue}
                    </span>)}
                    </>),
                    right: (<>
                        <PlButton icon="el-icon-arrow-right" mode="text" size={StyleSize.mini} onClick={methods.nextMonth}/>
                        <PlButton icon="el-icon-d-arrow-right" mode="text" size={StyleSize.mini} onClick={methods.nextYear}/>
                    </>),
                    content: (<>
                        <ul class="pl-date-base-panel-date-week-list">
                            {weekList.value.map(item => (
                                <li class="pl-date-base-panel-item pl-date-base-panel-date-week-item" key={item}>
                                    <div><span>{item}</span></div>
                                </li>
                            ))}
                        </ul>
                        <PlList class="pl-date-base-panel-date-list" tag="ul" {...createEventListener({onMouseleave: emit.onMouseleaveDateList})}>
                            {dateList.value.map((item, index) => (
                                DatePanelItemWrapper({
                                    item,
                                    onClick: externalHandler.onClick,
                                    onMouseenter: externalHandler.onMouseenter,
                                    Node: <PlItem
                                        {...{
                                            tag: 'li',
                                            class: ['pl-date-base-panel-date-item', {'pl-date-base-panel-date-item-other-month': !item.externals.isSelectMonth,}],
                                            key: item.externals.isSelectMonth ? item.pd.date : `_${index}`,
                                        }}
                                    />,
                                })
                            ))}
                        </PlList>
                    </>),
                })
                return <Wrapper {...{class: 'pl-date-base-panel-date', direction: 'horizontal', key: 'date'}}/>
            },
            month: () => {
                return <PlDatePanelMonth {...monthAttrs.value} direction="horizontal" key={viewModel.value}/>
            },
            time: () => {
                const Wrapper: any = DatePanelWrapper({
                    center: (<>
                        <span onClick={() => methods.changeView(DateView.date)}>
                            {showTimePd.value.year}-{zeroize(showTimePd.value.month! + 1)}-{zeroize(showTimePd.value.date!)}
                        </span>
                    </>),
                    content: <PlTimePanel {...timeAttrs.value}/>,
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