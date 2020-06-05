import {computed, defineComponent, watch} from "@vue/composition-api";
import {DateBasePanelItemData, DateEmitInputType, DatePublicProps, DateView, DefaultFormatString, PanelItemParam, SlideTransitionDirection} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useDate} from "@/packages/date/useDate";
import {PlainDate} from "@/util/PlainDate";

export default defineComponent({
    name: 'pl-date-base-panel-year',
    props: {
        ...DatePublicProps,
        displayFormat: {type: String, default: DefaultFormatString.year},
        valueFormat: {type: String, default: DefaultFormatString.year},
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string, type: DateEmitInputType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const {targetPanelItemParam, firstDatePanel, state, setSelectDate, model, startModel, endModel, viewModel, displayFormat, valueFormat} = useDate({
            props,
            injectView: DateView.year,
            getProvideData: (panelItemParam) => ({} as any)
        })

        const data = computed(() => {
            let {selectDate, today} = state
            let selectYear = selectDate.year
            selectYear = selectYear - selectYear % 20

            const panelItemPanel = targetPanelItemParam.value
            const {range} = panelItemPanel

            let list: DateBasePanelItemData[] = []
            for (let i = selectYear; i < selectYear + 20; i++) {

                state.tempPd.setYear(i)
                const ipd = state.tempPd.copy()

                let item: DateBasePanelItemData = {
                    label: i,
                    now: i === today.year,
                    disabled: utils.getDisabled(i, panelItemPanel),
                    active: utils.getActive(i, panelItemPanel),
                    hoverStart: false,
                    hover: false,
                    hoverEnd: false,
                    ipd,

                    range,
                    year: i,
                }

                if (range) {
                    item.hoverStart = utils.getHoverStart(i, panelItemPanel)
                    item.hover = utils.getHover(i, panelItemPanel)
                    item.hoverEnd = utils.getHoverEnd(i, panelItemPanel)
                }

                list.push(item)
            }

            return {
                list,                                               // 年份可选列表
                title: `${selectYear}-${selectYear + 19}`,          // 年份面板标题，展示列表中年份的范围
                selectYear,                                         // 当前选择的年份
            }
        })

        const utils = {
            /**
             * 检查年份是否需要禁用
             * @author  韦胜健
             * @date    2020/4/15 11:17
             */
            getDisabled(item, {max, min}: PanelItemParam) {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildDisabled) {
                    return firstDatePanel.value!.getChildDisabled(item, DateView.year)
                }
                if (!!max && !max.isNull && max.year! < item) return true
                if (!!min && !min.isNull && min.year! > item) return true
            },
            /**
             * 检查需要激活高亮的年份
             * @author  韦胜健
             * @date    2020/4/15 11:17
             */
            getActive(item, {value, valueRange: [valueStart, valueEnd], range}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildActive) {
                    return firstDatePanel.value!.getChildActive(item, DateView.year)
                }
                if (!range) {
                    if (!Array.isArray(value)) {
                        value = [value!]
                    }
                    return value.some(iv => (!iv.isNull && iv.year === item))
                } else {
                    return valueStart.year == item || valueEnd.year == item
                }
            },

            getHoverStart(item, {hoverRange, valueRange}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHoverStart) {
                    return firstDatePanel.value!.getChildHoverStart(item, DateView.year)
                }
                return !!hoverRange ? (hoverRange[0].year == item) : valueRange[0].year == item
            },
            getHover(item, {hoverRange, valueRange}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHover) {
                    return firstDatePanel.value!.getChildHover(item, DateView.year)
                }
                return !!hoverRange ? (hoverRange[0].year! < item && hoverRange[1].year! > item) : ((!valueRange[0].isNull && !valueRange[1].isNull) && valueRange[0].year! < item && valueRange[1].year! > item)
            },
            getHoverEnd(item, {hoverRange, valueRange}: PanelItemParam): boolean {
                if (!!firstDatePanel.value && !!firstDatePanel.value!.getChildHoverEnd) {
                    return firstDatePanel.value!.getChildHoverEnd(item, DateView.year)
                }
                return !!hoverRange ? (hoverRange[1].year == item) : valueRange[1].year == item
            },
        }

        const methods = {
            /**
             * 切换上一个年份列表
             * @author  韦胜健
             * @date    2020/4/15 11:17
             */
            prevYearList() {
                state.transitionDirection = SlideTransitionDirection.prev
                state.selectDate.setYear(data.value.selectYear - 20)
                setSelectDate(state.selectDate)
            },
            /**
             *
             * @author  切换下一个年份列表
             * @date    2020/4/15 11:18
             */
            nextYearList() {
                state.transitionDirection = SlideTransitionDirection.next
                state.selectDate.setYear(data.value.selectYear + 20)
                setSelectDate(state.selectDate)
            },
        }

        const handler = {
            /**
             * 处理点击分年元素动作
             * @author  韦胜健
             * @date    2020/4/15 11:18
             */
            clickItem({ipd}: DateBasePanelItemData) {

                if (!props.range) {
                    model.value = ipd!.year
                } else {
                    if (!state.hoverRange) {
                        state.hoverRange = [ipd, ipd]
                        state.valueRange = [ipd, ipd]
                    } else {

                        const [startPd, endPd] = state.hoverRange as [PlainDate, PlainDate]

                        startModel.value = startPd.year
                        endModel.value = endPd.year

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.input(startModel.value, DateEmitInputType.start)
                        emit.input(endModel.value, DateEmitInputType.end)
                    }
                }
            },
            /**
             * 处理鼠标进入年份元素动作
             * @author  韦胜健
             * @date    2020/4/15 11:18
             */
            onMouseEnterItem({ipd}) {
                if (!!state.hoverRange) {
                    let mid = state.valueRange[0]
                    state.hoverRange = mid.year > ipd.year ? [ipd, mid] : [mid, ipd]
                }
            },
        }

        watch(() => props.value, (val) => {
            state.transitionDirection = val == null ? 'next' : val > data.value.selectYear + 19 ? 'next' : 'prev'
            state.selectDate.setYear(val || state.today.year)
            setSelectDate(state.selectDate)
        }, {lazy: true})

        watch(() => props.start, val => {
            const startPd = new PlainDate(val, displayFormat.value, valueFormat.value)
            const endPd = new PlainDate(endModel.value, displayFormat.value, valueFormat.value)

            state.valueRange = [startPd, endPd]
            state.hoverRange = null

            state.transitionDirection = val == null ? 'next' : val > data.value.selectYear + 19 ? 'next' : 'prev'
            state.selectDate.setYear(val || state.today.year)
            setSelectDate(state.selectDate)
        }, {lazy: true})

        watch(() => props.end, val => {
            const startPd = new PlainDate(startModel.value, displayFormat.value, valueFormat.value)
            const endPd = new PlainDate(val, displayFormat.value, valueFormat.value)

            state.valueRange = [startPd, endPd]
            state.hoverRange = null
        }, {lazy: true})

        return () => (
            <pl-date-base-panel class="pl-date-base-panel-year" direction={props.direction} {...{on: {'mousedown-panel': emit.mousedownPanel}}}>
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={methods.prevYearList}/>
                </template>
                <template slot="center">
                    <span class="pl-date-base-panel-header-static-label">{data.value.title}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={methods.nextYearList}/>
                </template>
                <template slot="content">
                    <transition name={`pl-transition-slide-${state.transitionDirection}`}>
                        <ul class="pl-date-base-panel-year-list" key={data.value.selectYear} direction="vertical">
                            {data.value.list.map(item => (
                                <pl-date-base-panel-item
                                    class="pl-date-base-panel-year-item"
                                    item={item}
                                    onClick={handler.clickItem}
                                    onMouseenter={handler.onMouseEnterItem}
                                    key={item.year}
                                />
                            ))}
                        </ul>
                    </transition>
                </template>
            </pl-date-base-panel>
        )
    },
})