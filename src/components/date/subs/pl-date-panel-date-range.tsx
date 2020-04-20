import {DatePublicMixin, DatePublicProps, DateView, PanelItemParam, PanelParentProvider} from "./index";
import {PlainDate} from "../../../utils/PlainDate";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-date-panel-date-range',
    mixins: [
        DatePublicMixin,
        EmitMixin,
    ],
    props: {
        range: {type: Boolean, default: true},
        view: {type: String, default: DateView.date}
    },
    emitters: {
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
        emitInput: Function,
        emitMousedownPanel: Function,
    },
    watch: {
        start(val) {
            if (this.p_start != val) {
                this.p_start = val
                const {displayFormat, valueFormat} = this.formatString
                this.valueRange = [new PlainDate(val, displayFormat, valueFormat), new PlainDate(this.p_end, displayFormat, valueFormat)]
                this.hoverRange = null

                const startPd = new PlainDate(val, displayFormat, valueFormat)
                this.p_selectDate = startPd.isNull ? this.today : startPd.copy()
            }
        },
        end(val) {
            if (this.p_end != val) {
                this.p_end = val
                const {displayFormat, valueFormat} = this.formatString

                this.valueRange = [new PlainDate(this.p_start, displayFormat, valueFormat), new PlainDate(val, displayFormat, valueFormat)]
                this.hoverRange = null
            }
        },
    },
    render(h) {
        return (
            <div class="pl-date-base-panel pl-date-panel-date-range">
                <pl-date-base-panel-date {...this.binding.start} {...{on: {'mousedown-panel': e => this.emitMousedownPanel(e, 'start')}}}/>
                <pl-date-base-panel-date {...this.binding.end} {...{on: {'mousedown-panel': e => this.emitMousedownPanel(e, 'end')}}}/>
            </div>
        )
    },
    computed: {
        formatData() {
            const {displayFormat, valueFormat} = this.formatString
            let {p_start: start, p_end: end, defaultTime: defaultTimeString} = this

            const startDate = new PlainDate(start, displayFormat, valueFormat)
            const endDate = new PlainDate(end, displayFormat, valueFormat)

            if (!defaultTimeString) defaultTimeString = '12:00:00'
            let defaultTime = new PlainDate(defaultTimeString, 'HH:mm:ss', 'HH:mm:ss')

            const startTime = defaultTime.copy()
            if (!startDate.isNull) {
                startTime.setHms(startDate)
            }

            const endTime = defaultTime.copy()
            if (!endDate.isNull) {
                endTime.setHms(endDate)
            }

            return {
                defaultTime,
                startDate,
                endDate,
                startTime,
                endTime,
            }
        },

        binding() {
            const {p_selectDate} = this
            const {displayFormat, valueFormat} = this.formatString

            const publicProps = Object.keys(DatePublicProps).reduce((ret, key) => {
                ret[key] = this[key]
                return ret
            }, {})

            Object.assign(publicProps, {
                displayFormat,
                valueFormat,
                range: true
            })

            const start = {
                props: {
                    ...publicProps,
                    selectDate: p_selectDate,
                    value: this.p_start,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        this.p_selectDate = val
                    },
                    'mouseenter-item': this.onMouseenterItem,
                    'click-item': (item) => this.onClickItem(item, 'start'),
                    'select-time': (val) => this.onSelectTime(val, 'start')
                },
            }

            const endSelectDate = p_selectDate.copy()
            endSelectDate.setMonthDate(endSelectDate.month + 1, 1)

            const end = {
                props: {
                    ...publicProps,
                    selectDate: endSelectDate,
                    value: this.p_end,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        val.setMonthDate(val.month - 1, 1)
                        this.p_selectDate = val.copy()
                    },
                    'mouseenter-item': this.onMouseenterItem,
                    'click-item': (item) => this.onClickItem(item, 'end'),
                    'select-time': (val) => this.onSelectTime(val, 'end')
                },
            }

            return {
                start,
                end
            }
        },
        provideData(): PanelParentProvider {
            const {value, hoverRange, valueRange, max, min} = this.panelItemParam as PanelItemParam
            return {
                year: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                },
                month: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                },
                date: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                    max,
                    min,
                },
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getActive(ipd: PlainDate, {valueRange: [startPd, endPd]}: PanelItemParam) {
            return ((!startPd.isNull && startPd.YMD === ipd.YMD) || (!endPd.isNull && endPd.YMD === ipd.YMD))
        },
        getHoverStart(ipd: PlainDate, {hoverRange, valueRange: [startPd,]}: PanelItemParam) {
            return !!hoverRange ? hoverRange[0].YMD === ipd.YMD : (!startPd.isNull && startPd.YMD === ipd.YMD)
        },
        getHover(ipd: PlainDate, {hoverRange, valueRange: [startPd, endPd]}: PanelItemParam) {
            return !!hoverRange ?
                hoverRange[0].YMD < ipd.YMD && hoverRange[1].YMD > ipd.YMD :
                (!startPd.isNull && startPd.YMD < ipd.YMD) && (!endPd.isNull && endPd.YMD > ipd.YMD)
        },
        getHoverEnd(ipd: PlainDate, {hoverRange, valueRange: [, endPd]}: PanelItemParam) {
            return !!hoverRange ? hoverRange[0].YMD === ipd.YMD : (!endPd.isNull && endPd.YMD === ipd.YMD)
        },

        emitValue(startPd: PlainDate, endPd: PlainDate) {

            const {max, min} = this.panelItemParam

            if (!max.isNull && (this.datetime ? max.YMDHms < startPd.YMDHms : max.YMD < startPd.YMD)) {
                startPd = max
            } else if (!min.isNull && (this.datetime ? min.YMDHms > startPd.YMDHms : min.YMD > startPd.YMD)) {
                startPd = min
            }

            if (!max.isNull && (this.datetime ? max.YMDHms < endPd.YMDHms : max.YMD < endPd.YMD)) {
                endPd = max
            } else if (!min.isNull && (this.datetime ? min.YMDHms > endPd.YMDHms : min.YMD > endPd.YMD)) {
                endPd = min
            }

            this.p_start = startPd.valueString
            this.p_end = endPd.valueString

            this.hoverRange = null
            this.valueRange = [startPd, endPd]

            this.emitUpdateStart(this.p_start)
            this.emitInput(this.p_start, 'start')
            this.emitUpdateEnd(this.p_end)
            this.emitInput(this.p_end, 'end')
        },
        /*---------------------------------------handler-------------------------------------------*/
        async onClickItem(ipd: PlainDate) {
            await this.$plain.nextTick()
            const {startTime, endTime} = this.formatData as { [key: string]: PlainDate }
            const {hoverRange} = this

            if (!hoverRange) {
                ipd = ipd.copy()
                this.hoverRange = [ipd, ipd]
                this.valueRange = [ipd, ipd]
            } else {
                let [startPd, endPd] = hoverRange as [PlainDate, PlainDate]
                startPd = startPd.copy()
                endPd = endPd.copy()

                startPd.setHms(startTime)
                endPd.setHms(endTime)

                if ((this.datetime ? startPd.YMDHms > endPd.YMDHms : startPd.YMD > endPd.YMD)) {
                    endPd = startPd
                }

                this.emitValue(startPd, endPd)
            }
        },
        onMouseenterItem({ipd}: DateBasePanelItemData) {
            if (!!this.hoverRange) {
                let midPd = this.valueRange[0] as PlainDate
                ipd = ipd.copy()
                this.hoverRange = midPd.YMD > ipd.YMD ? [ipd, midPd] : [midPd, ipd]
            }
        },
        async onSelectTime(val: string, type: 'start' | 'end') {
            await this.$plain.nextTick()

            let {p_selectDate} = this as { [key: string]: PlainDate }
            let {startDate, endDate, defaultTime} = this.formatData as { [key: string]: PlainDate }
            defaultTime = defaultTime.copy()
            defaultTime.setValue(val)

            if (type === 'start') {
                if (startDate.isNull) {
                    startDate.setYMD(p_selectDate)
                }
                startDate.setHms(defaultTime)
                if (endDate.isNull) {
                    endDate = startDate.copy()
                } else {
                    if ((this.datetime ? startDate.YMDHms > endDate.YMDHms : startDate.YMD > endDate.YMD)) {
                        endDate = startDate.copy()
                    }
                }
            } else if (type === 'end') {
                if (endDate.isNull) {
                    endDate.setYMD(p_selectDate)
                }
                endDate.setHms(defaultTime)
                if (startDate.isNull) {
                    startDate = endDate.copy()
                } else {
                    if ((this.datetime ? startDate.YMDHms > endDate.YMDHms : startDate.YMD > endDate.YMD)) {
                        startDate = endDate.copy()
                    }
                }
            }

            this.emitValue(startDate, endDate)
        },
    },
}