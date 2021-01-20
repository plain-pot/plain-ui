import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, DateView, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {PropType, computed, Transition} from 'vue';
import {useDate, UseDateJudgementView} from "../useDate";
import {PlButton} from "../../button/button";
import {StyleSize} from "../../../use/useStyle";
import {PlDatePanelYear} from "./date-panel-year";
import {useClass} from "../../../use/useClasses";

export const PlDatePanelMonth = designComponent({
    name: 'pl-date-panel-month',
    props: {
        ...DatePublicProps,
        view: {type: String as PropType<DateView>, default: DateView.month},
    },
    emits: {
        ...DatePublicEmits,
        onClick: (did: DateItemData) => true,
        onMouseenter: (did: DateItemData) => true,
        onMouseleaveList: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const months = computed(() => ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',])

        const {
            state,
            setSelectDate,
            today,
            getStatus,
            handler,
            viewModel,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YM,
            getSlide: (pd) => pd.year > state.selectDate.year ? SlideTransitionDirection.next : SlideTransitionDirection.prev,
        })

        const methods = {
            /**
             * 切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            prevYear() {
                state.slide = SlideTransitionDirection.prev
                setSelectDate(state.selectDate.useYear(state.selectDate.year - 1))
            },
            /**
             * 切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            nextYear() {
                state.slide = SlideTransitionDirection.next
                setSelectDate(state.selectDate.useYear(state.selectDate.year + 1))
            },
        }

        const monthList = computed(() => {
            const {selectDate} = state
            let list: DateItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {
                const pd = today.useYMD([selectDate.year, i, 1]);
                const item = {label: months.value[i], pd, ...getStatus(pd)}
                list.push(item)
            })
            return list
        })

        const quarterList = computed(() => {
            const {selectDate} = state
            let list: DateItemData[] = [];
            [0, 1, 2, 3].forEach(i => {
                const pd = selectDate.useMonthDate(i * 3, 1);
                list.push({label: `Q${i + 1}`, pd, ...getStatus(pd),})
            })
            return list
        })

        const listClasses = useClass(() => [
            'pl-date-base-panel-month-list',
            {
                'pl-date-base-panel-month-list-show-quarter': props.showQuarter,
            }
        ])

        const externalHandler = {
            /**
             * 处理年份面板选择年份变化动作
             * @author  韦胜健
             * @date    2020/4/15 11:14
             */
            onSelectYearChange(val?: string | string[]) {
                viewModel.value = DateView.month
                setSelectDate(state.selectDate.useYear(val as any as number))
            },
            onClick: (did: DateItemData) => {
                emit.onClick(did)
                handler.onClick(did)
            },
            onMouseenter: (did: DateItemData) => {
                emit.onMouseenter(did)
                handler.onMouseenter(did)
            },
        }

        return {
            render: () => {

                const Month = DatePanelWrapper({
                    left: <PlButton icon="el-icon-d-arrow-left" mode="text" size={StyleSize.mini} onClick={methods.prevYear}/>,
                    center: <span onClick={() => viewModel.value = DateView.year}>{state.selectDate.year}</span>,
                    right: <PlButton icon="el-icon-d-arrow-right" mode="text" size={StyleSize.mini} onClick={methods.nextYear}/>,
                    bodyAttrs: {onMouseleave: emit.onMouseleaveList},
                    content: (<>
                        {props.showQuarter && (
                            <Transition name={`pl-transition-slide-${state.slide}`}>
                                <ul {...{
                                    class: 'pl-date-base-panel-month-quarter-list',
                                    key: state.selectDate.year!,
                                    direction: 'vertical'
                                }}>
                                    {quarterList.value.map(item => (DatePanelItemWrapper({
                                        item,
                                        onClick: externalHandler.onClick,
                                        onMouseenter: externalHandler.onMouseenter,
                                        Node: <li class="pl-date-base-panel-month-item" key={item.label}/>,
                                    })))}
                                </ul>
                            </Transition>
                        )}
                        <Transition name={`pl-transition-slide-${state.slide}`}>
                            <ul {...{
                                class: listClasses.value,
                                key: state.selectDate.year!,
                                direction: 'vertical'
                            }}>
                                {monthList.value.map(item => (DatePanelItemWrapper({
                                    item,
                                    onClick: externalHandler.onClick,
                                    onMouseenter: externalHandler.onMouseenter,
                                    Node: <li class="pl-date-base-panel-month-item" key={item.label}/>,
                                })))}
                            </ul>
                        </Transition>
                    </>)
                }) as any

                const Wrapper = (
                    <div {...{
                        class: 'pl-date-base-panel pl-date-base-panel-month-wrapper',
                        direction: props.direction,
                    }}>
                        <Transition name={`pl-transition-slide-${viewModel.value === DateView.year ? 'prev' : 'next'}`}>
                            {viewModel.value === DateView.month ? <Month {...{class: 'pl-date-base-panel-month', direction: 'horizontal'}}/> : (
                                <PlDatePanelYear
                                    modelValue={String(state.selectDate.year)}
                                    onUpdateModelValue={externalHandler.onSelectYearChange}
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