import {computed, Transition} from 'vue'
import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, Dbpid, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PlButton} from "../../button/button";
import {StyleSize} from "../../../use/useStyle";

export const PlDateBasePanelYear = designComponent({
    name: 'pl-date-base-panel-year',
    props: {
        ...DatePublicProps,
        displayFormat: {type: String, default: DefaultDateFormatString.year},
        valueFormat: {type: String, default: DefaultDateFormatString.year},
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const {
            state,
            today,
            tempPd,
            setSelectDate,
            model,
            startModel,
            endModel,
            getStatus,
        } = useDate({
            props,
            emit,
            useModelConfig: {
                model: {
                    onChange: (val) => {
                        state.slide = val == null ? SlideTransitionDirection.next : val > data.value.selectYear + 19 ? SlideTransitionDirection.next : SlideTransitionDirection.prev
                        state.selectDate.setYear(val || today.year)
                        setSelectDate(state.selectDate)
                    }
                },
                start: {
                    onChange: (val) => {
                        tempPd.setValue(val)
                        const startPd = tempPd.copy()
                        tempPd.setValue(endModel.value)
                        const endPd = tempPd.copy()

                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null

                        state.slide = val == null ? SlideTransitionDirection.next : val > data.value.selectYear + 19 ? SlideTransitionDirection.next : SlideTransitionDirection.prev
                        state.selectDate.setYear(val || today.year)
                        setSelectDate(state.selectDate)
                    }
                },
                end: {
                    onChange: (val) => {
                        tempPd.setValue(startModel.value)
                        const startPd = tempPd.copy()
                        tempPd.setValue(val)
                        const endPd = tempPd.copy()

                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null
                    }
                }
            },
            jdView: UseDateJudgementView.Y,
        })

        const data = computed(() => {
            const {selectDate} = state
            let selectYear = selectDate.year!
            selectYear = selectYear - selectYear % 20

            let list: Dbpid[] = []

            for (let i = selectYear; i < selectYear + 20; i++) {
                tempPd.setYear(i)
                const ipd = tempPd.copy()
                let item: Dbpid = {
                    label: i,
                    ipd,
                    ...getStatus(ipd),
                }
                list.push(item)
            }

            return {
                list,
                /*年份面板标题，展示列表中年份的范围*/
                title: `${selectYear}-${selectYear + 19}`,
                /*当前选择的年份*/
                selectYear,
            }
        })

        const methods = {
            /**
             * 切换上一个年份列表
             * @author  韦胜健
             * @date    2020/4/15 11:17
             */
            prevYearList() {
                state.slide = SlideTransitionDirection.prev
                state.selectDate.setYear(data.value.selectYear - 20)
                setSelectDate(state.selectDate)
            },
            /**
             *
             * @author  切换下一个年份列表
             * @date    2020/4/15 11:18
             */
            nextYearList() {
                state.slide = SlideTransitionDirection.next
                state.selectDate.setYear(data.value.selectYear + 20)
                setSelectDate(state.selectDate)
            },
        }

        const handler = {
            onClickItem: ({ipd}: Dbpid) => {
                if (!props.range) {
                    model.value = ipd.isNull ? undefined : String(ipd!.year)
                } else {
                    if (!state.hoverRange) {
                        state.hoverRange = [ipd, ipd]
                        state.valueRange = [ipd, ipd]
                    } else {

                        const [startPd, endPd] = state.hoverRange

                        startModel.value = startPd.isNull ? undefined : String(startPd.year)
                        endModel.value = endPd.isNull ? undefined : String(endPd.year)

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.onUpdateModelValue(startModel.value, DateEmitRangeType.start)
                        emit.onUpdateModelValue(endModel.value, DateEmitRangeType.end)
                    }
                }
            },
            onMouseenterItem({ipd}: Dbpid) {
                if (!!state.hoverRange) {
                    let mid = state.valueRange[0]
                    state.hoverRange = mid.year! > ipd.year! ? [ipd, mid] : [mid, ipd]
                }
            },
        }

        return {
            render: () => {
                const Wrapper = DatePanelWrapper({
                    left: <PlButton icon="el-icon-d-arrow-left" mode="text" size={StyleSize.mini} onClick={methods.prevYearList}/>,
                    center: <span class="pl-date-base-panel-header-static-label">{data.value.title}</span>,
                    right: <PlButton icon="el-icon-d-arrow-right" mode="text" size={StyleSize.mini} onClick={methods.nextYearList}/>,
                    content: (<Transition name={`pl-transition-slide-${state.slide}`}>
                        <ul{...{
                            class: 'pl-date-base-panel-year-list',
                            key: data.value.selectYear,
                            direction: "vertical"
                        }}>
                            {data.value.list.map(item => DatePanelItemWrapper({
                                item,
                                Node: (<li key={item.label} class="pl-date-base-panel-year-item"/>),
                                onClick: handler.onClickItem,
                                onMouseenter: handler.onMouseenterItem,
                            }))}
                        </ul>
                    </Transition>)

                })
                return <Wrapper {...{class: 'pl-date-base-panel-year', direction: props.direction,}}/>
            }
        }
    },
})