import {BaseTimePanelProps} from "./index";
import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";

export default {
    name: "pl-time-base-panel",
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
    },
    props: {
        ...BaseTimePanelProps,
    },
    data() {
        return {}
    },
    render(h) {

        let layout = {
            h: <pl-time-base-column layout="h" value={this.formatData.value.hour} onChange={val => this.onColumnChange(val, 'h')} max={this.maxmin.max.hour} min={this.maxmin.min.hour}/>,
            m: <pl-time-base-column layout="m" value={this.formatData.value.minute} onChange={val => this.onColumnChange(val, 'm')} max={this.maxmin.max.minute} min={this.maxmin.min.minute}/>,
            s: <pl-time-base-column layout="s" value={this.formatData.value.second} onChange={val => this.onColumnChange(val, 's')} max={this.maxmin.max.second} min={this.maxmin.min.second}/>,
        }
        const content = this.layout.map(i => layout[i])

        return (
            <div class="pl-time-base-panel">
                {content}
            </div>
        )
    },
    computed: {
        formatData() {
            let {value, max, min} = this
            value = new PlainDate(value, this.displayFormat, this.valueFormat)
            max = new PlainDate(max, this.displayFormat, this.valueFormat)
            min = new PlainDate(min, this.displayFormat, this.valueFormat)
            return {
                value, max, min
            }
        },
        maxmin() {
            const max = {
                hour: null,
                minute: null,
                second: null,
            }
            const min = {
                hour: null,
                minute: null,
                second: null,
            }

            const {max: maxpd, min: minpd, value: vpd} = this.formatData

            if (!!maxpd.hour) {
                max.hour = maxpd.hour
                if (vpd.hour == null) {
                    // 有最大值，但是没有选择【时】的情况下，分以及秒不能选择任意选项
                    max.minute = -1
                    max.second = -1
                } else {
                    if (vpd.hour < max.hour) {
                        // 有最大值，但是【时】没有达到最大值，此时分以及秒可以任意选择
                        max.minute = null
                        max.second = null
                    } else {
                        max.minute = maxpd.minute
                        if (vpd.minute == null) {
                            max.second = -1
                        } else {
                            if (vpd.minute < max.minute) {
                                max.second = null
                            } else {
                                max.second = maxpd.second
                            }
                        }
                    }
                }
            }

            if (!!minpd.hour) {
                min.hour = minpd.hour
                if (vpd.hour == null) {
                    // 有最小值，但是没有选择【时】的情况下，分以及秒不能选择任意选项
                    min.minute = -1
                    min.second = -1
                } else {
                    if (vpd.hour > min.hour) {
                        // 有最小值，但是【时】没有达到最小值，此时分以及秒可以任意选择
                        min.minute = null
                        min.second = null
                    } else {
                        min.minute = minpd.minute
                        if (vpd.minute == null) {
                            min.second = -1
                        } else {
                            if (vpd.minute > min.minute) {
                                min.second = null
                            } else {
                                min.second = minpd.second
                            }
                        }
                    }
                }
            }

            return {
                max, min,
            }
        },
    },
    created() {
        // console.log(this.formatData)
    },
    methods: {
        onColumnChange(value, type) {
            const {value: vpd, max: maxpd, min: minpd} = this.formatData as { value: PlainDate, max: PlainDate, min: PlainDate }
            switch (type) {
                case 'h':
                    vpd.setHour(value)
                    break
                case 'm':
                    vpd.setMinute(value)
                    break
                case 's':
                    vpd.setSecond(value)
                    break
            }

            if (!maxpd.isNull && vpd.greaterThan(maxpd)) {
                vpd.setValue(maxpd.valueString)
            }

            if (!minpd.isNull && vpd.lessThan(minpd)) {
                vpd.setValue(minpd.valueString)
            }

            this.emitInput(vpd.valueString)
        },
    },
}