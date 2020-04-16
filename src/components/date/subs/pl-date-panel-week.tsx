import {DatePublicMixin, DateView} from "./index";
import {PlainDate} from "../../../utils/PlainDate";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";

export default {
    name: 'pl-date-panel-week',
    mixins: [
        DatePublicMixin,
    ],
    props: {},
    data() {
        const {value: p_value, start: p_start, end: p_end} = this
        const {displayFormat, valueFormat} = this.getFormatString()

        const startPd = new PlainDate(p_start, displayFormat, valueFormat)
        const endPd = new PlainDate(p_end, displayFormat, valueFormat)

        const hoverRange: [PlainDate, PlainDate] = null
        const valueRange = [startPd, endPd]

        const hoverPd: PlainDate = null

        return {
            p_value,
            p_start,
            p_end,

            hoverRange,
            valueRange,
            hoverPd,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date {...this.datePanelBinding}/>
        )
    },
    computed: {
        formatData() {
            let {p_start: start, p_end: end, max, min} = this
            const {displayFormat, valueFormat} = this.formatString

            start = new PlainDate(start, displayFormat, valueFormat)
            end = new PlainDate(end, displayFormat, valueFormat)
            max = new PlainDate(max, displayFormat, valueFormat)
            min = new PlainDate(min, displayFormat, valueFormat)

            return {
                start,
                end,
                max,
                min,
            }
        },
        datePanelBinding() {
            return {
                class: 'pl-date-panel-week',
                props: {
                    range: true,
                    dateListBinding: {
                        nativeOn: {
                            'mouseleave': () => {
                                this.hoverPd = null
                            }
                        },
                    },
                },
                on: {
                    'mouseenter-item': ({ipd}: DateBasePanelItemData) => {
                        this.hoverPd = ipd
                    }
                },
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getFirstWeekDayByPlainDate(pd: PlainDate): PlainDate {
            let day = pd.day
            let firstWeekDay = this.firstWeekDay
            let startPd = pd.copy()
            startPd.setMonthDate(startPd.month, startPd.date - (day - firstWeekDay))
            return startPd
        },
        /**
         * ipd是否处于weekPd所在的周范围之内
         * @author  韦胜健
         * @date    2020/4/16 16:07
         */
        isHover(weekPd: PlainDate, ipd: PlainDate) {
            let startPd = this.getFirstWeekDayByPlainDate(weekPd)
            let endPd = startPd.copy()
            endPd.setMonthDate(endPd.month, endPd.date + 6)
            let ret = ipd.greaterThan(startPd, PlainDate.CompareMode.date) >= 0 && ipd.lessThan(endPd, PlainDate.CompareMode.date) >= 0
            return ret
        },

        getActive(ipd: PlainDate | number, type: DateView) {

        },
        getHoverStart(ipd: PlainDate | number, type: DateView) {

        },
        getHover(ipd: PlainDate | number, type: DateView) {
            if (type === DateView.date) {
                ipd = ipd as PlainDate
                if (!!this.hoverPd) {
                    if (this.isHover(this.hoverPd, ipd)) {
                        return true
                    }
                }
            }
        },
        getHoverEnd(ipd: PlainDate | number, type: DateView) {

        },
        /*---------------------------------------handler-------------------------------------------*/

    },
}