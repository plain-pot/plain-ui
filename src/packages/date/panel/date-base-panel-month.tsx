import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, DateView, Dbpid, DefaultDateFormatString, SlideTransitionDirection} from '../date.utils';
import {computed, Transition} from 'vue';
import {useDate, UseDateJudgementView} from "../useDate";

export default designComponent({
    name: 'pl-date-base-panel-month',
    props: {
        ...DatePublicProps,

        displayFormat: {type: String, default: DefaultDateFormatString.month},
        valueFormat: {type: String, default: DefaultDateFormatString.month},
        view: {type: String, default: DateView.month},
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const months = computed(() => ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',])

        const {
            state,
            setSelectDate,
            today,
            tempPd,
            model,
            startModel,
            endModel,
            viewModel,
            utils,
        } = useDate({
            props,
            emit,
            useModelConfig: {
                model: {
                    onChange: val => {
                        // 这个val 是按照displayFormat和valueFormat格式的字符串，不能直接 setSelectYear 赋值
                        if (!val) {
                            methods.setSelectYear(today.year!)
                        } else {
                            tempPd.setValue(val)
                            methods.setSelectYear(tempPd.year!)
                        }
                    }
                },
                start: {
                    onChange: val => {
                        tempPd.setValue(val)
                        const startPd = tempPd.copy()
                        tempPd.setValue(endModel.value)
                        const endPd = tempPd.copy()
                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null
                        methods.setSelectYear(startPd.year || today.year!)
                    }
                },
                end: {
                    onChange: val => {
                        tempPd.setValue(startModel.value)
                        const startPd = tempPd.copy()
                        tempPd.setValue(val)
                        const endPd = tempPd.copy()

                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null
                    }
                },
            },
            jdView: UseDateJudgementView.YM,
        })

        const methods = {
            /**
             * 设置当前选择的年份
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            setSelectYear(target: number) {
                if (!target) {
                    target = today.year!
                }
                state.slide = state.selectDate.year! > target ? SlideTransitionDirection.prev : SlideTransitionDirection.next
                state.selectDate.setYear(target)
                setSelectDate(state.selectDate)
            },
            /**
             * 切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            prevYear() {
                state.slide = SlideTransitionDirection.prev
                state.selectDate.setYear(state.selectDate.year! - 1)
                setSelectDate(state.selectDate)
            },
            /**
             * 切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            nextYear() {
                state.slide = SlideTransitionDirection.next
                state.selectDate.setYear(state.selectDate.year! + 1)
                setSelectDate(state.selectDate)
            },
        }

        const monthList = computed(() => {
            const {selectDate} = state
            let list: Dbpid[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {
                tempPd.setYear(selectDate.year!)
                tempPd.setMonthDate(i, 1)
                const ipd = tempPd.copy()
                const item = {
                    /*data*/
                    label: months.value[i],
                    ipd,
                    /*status*/
                    now: today.YM === ipd.YM,
                    disabled: utils.disabled(ipd),
                    active: utils.active(ipd),
                    hoverStart: utils.hoverStart(ipd),
                    hoverEnd: utils.hoverEnd(ipd),
                    hover: utils.hover(ipd),
                    range: props.range,

                    month: i,
                }
                list.push(item)
            })
            return list
        })

        const handler = {
            /**
             * 处理点击月份元素的动作
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            onClickItem({ipd}: Dbpid) {

                const temp = state.selectDate.copy()
                temp.setMonthDate(ipd.month!, 1)

                if (!props.range) {
                    model.value = temp.valueString!
                } else {

                    if (!state.hoverRange) {

                        temp.setMonthDate(ipd.month!, 1)
                        state.hoverRange = [temp, temp]
                        state.valueRange = [temp, temp]

                    } else {
                        const [startPd, endPd] = state.hoverRange

                        startModel.value = startPd.valueString!
                        endModel.value = endPd.valueString!

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.updateModelValue(startModel.value, DateEmitRangeType.start)
                        emit.updateModelValue(endModel.value, DateEmitRangeType.end)
                    }
                }
            },
            /**
             * 处理鼠标进入月份元素的动作
             * @author  韦胜健
             * @date    2020/4/15 11:13
             */
            onMouseEnterItem({ipd}: Dbpid) {
                if (!!state.hoverRange) {
                    let midPd = state.valueRange[0]
                    const temp = state.selectDate.copy()
                    temp.setMonthDate(ipd.month!, 1)
                    state.hoverRange = midPd.YM! > temp.YM! ? [temp, midPd] : [midPd, temp]
                }
            },
            /**
             * 处理年份面板选择年份变化动作
             * @author  韦胜健
             * @date    2020/4/15 11:14
             */
            onSelectYearChange(val: number) {
                viewModel.value = DateView.month
                state.selectDate.setYear(val)
                setSelectDate(state.selectDate)
            },
        }

        return {
            render: () => {

                const Month = DatePanelWrapper({
                    left: <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={methods.prevYear}/>,
                    center: <span onClick={() => viewModel.value = DateView.year}>{state.selectDate.year}</span>,
                    right: <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={methods.nextYear}/>,
                    content: (
                        <Transition name={`pl-transition-slide-${state.slide}`}>
                            <ul {...{
                                class: 'pl-date-base-panel-month-list',
                                key: state.selectDate.year!,
                                direction: 'vertical'
                            }}>
                                {monthList.value.map(item => (DatePanelItemWrapper({
                                    item,
                                    onClick: handler.onClickItem,
                                    onMouseenter: handler.onMouseEnterItem,
                                    Node: <li class="pl-date-base-panel-month-item" key={item.month}/>,
                                })))}
                            </ul>
                        </Transition>
                    )
                }) as any

                const Wrapper = (
                    <div {...{
                        class: 'pl-date-base-panel pl-date-base-panel-month-wrapper',
                        direction: props.direction,
                    }}>
                        <Transition name={`pl-transition-slide-${viewModel.value === DateView.year ? 'prev' : 'next'}`}>
                            {viewModel.value === DateView.month ? <Month {...{class: 'pl-date-base-panel-month', direction: 'horizontal'}}/> : (
                                <pl-date-base-panel-year
                                    modelValue={String(state.selectDate.year)}
                                    onChange={handler.onSelectYearChange}
                                    direction="horizontal"/>
                            )}
                        </Transition>
                    </div>
                ) as any

                return <Wrapper/>
            }
        }
    },
})