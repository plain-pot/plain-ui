import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {computed, Transition} from 'vue';
import {PlButton} from "../../button/button";
import {StyleSize} from "../../../use/useStyle";

export const PlDatePanelYear = designComponent({
    name: 'pl-date-panel-year',
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
            setSelectDate,
            today,
            getStatus,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.Y
        })

        const data = computed(() => {
            const {selectDate} = state
            let selectYear = selectDate.year!
            selectYear = selectYear - selectYear % 20
            let list: DateItemData[] = []
            for (let i = selectYear; i < selectYear + 20; i++) {
                const pd = today.useYear(i)
                let item: DateItemData = {label: i, pd, ...getStatus(pd),}
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
                setSelectDate(today.useYear(data.value.selectYear - 20))
            },
            /**
             *
             * @author  切换下一个年份列表
             * @date    2020/4/15 11:18
             */
            nextYearList() {
                state.slide = SlideTransitionDirection.next
                setSelectDate(today.useYear(data.value.selectYear + 20))
            },
        }

        const handler = {
            onClickItem: () => {/*todo*/},
            onMouseenterItem: () => {/*todo*/},
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