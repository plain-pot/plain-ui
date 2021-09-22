import {DateItemData, DatePanelItemWrapper, DatePanelWrapper, DatePublicEmits, DatePublicProps, SlideTransitionDirection} from "../date.utils";
import {computed, designComponent} from "plain-ui-composition";
import PlButton from "../../PlButton";
import {StyleSize} from "../../../use/useStyle";

import {useDatePanel, UseDateJudgementView} from "../useDatePanel";
import {mergeProps} from "plain-ui-composition"

export const PlDatePanelYear = designComponent({
    name: 'pl-date-panel-year',
    props: {
        ...DatePublicProps,
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
            handler,
        } = useDatePanel({
            props,
            emit,
            jdView: UseDateJudgementView.Y,
            getSlide: (pd) => pd.year > data.value.selectYear + 19 ? SlideTransitionDirection.next : SlideTransitionDirection.prev,
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

        return {
            render: () => {
                const Wrapper = DatePanelWrapper({
                    left: <PlButton icon="el-icon-d-arrow-left" mode="text" size={StyleSize.mini} onClick={methods.prevYearList}/>,
                    center: <span class="pl-date-base-panel-header-static-label">{data.value.title}</span>,
                    right: <PlButton icon="el-icon-d-arrow-right" mode="text" size={StyleSize.mini} onClick={methods.nextYearList}/>,
                    content: (
                        <ul{...{
                            class: 'pl-date-base-panel-year-list',
                            key: data.value.selectYear,
                            direction: "vertical"
                        }}>
                            {data.value.list.map(item => DatePanelItemWrapper({
                                item,
                                Node: (<li key={item.label} class="pl-date-base-panel-year-item"/>),
                                onClick: handler.onClick,
                                onMouseenter: handler.onMouseenter,
                            }))}
                        </ul>
                    )
                })
                return mergeProps({child: Wrapper, attrs: {class: 'pl-date-base-panel-year', direction: props.direction,}})
            }
        }
    },
})
