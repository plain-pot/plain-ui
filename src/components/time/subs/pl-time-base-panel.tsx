import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {TimePublicProps} from "./index";

export default {
    name: "pl-time-base-panel",
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
    },
    props: {
        value: {type: String},
        ...TimePublicProps,
    },
    data() {
        return {}
    },
    render(h) {

        let layout = {
            h: <pl-time-base-column layout="h"
                                    value={this.formatData.value.hour}
                                    max={this.maxmin.max.hour}
                                    min={this.maxmin.min.hour}
                                    checkDisabled={this.p_checkDisabled}
                                    custom={this.p_custom}
                                    onChange={val => this.onColumnChange(val, 'h')}
            />,
            m: <pl-time-base-column layout="m"
                                    value={this.formatData.value.minute}
                                    max={this.maxmin.max.minute}
                                    min={this.maxmin.min.minute}
                                    checkDisabled={this.p_checkDisabled}
                                    custom={this.p_custom}
                                    onChange={val => this.onColumnChange(val, 'm')}
            />,
            s: <pl-time-base-column layout="s"
                                    value={this.formatData.value.second}
                                    max={this.maxmin.max.second}
                                    min={this.maxmin.min.second}
                                    checkDisabled={this.p_checkDisabled}
                                    custom={this.p_custom}
                                    onChange={val => this.onColumnChange(val, 's')}
            />,
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

        p_checkDisabled() {
            if (!this.checkDisabled) return null
            return (num, layout) => this.checkDisabled(num, layout, this.formatData.value)
        },
        p_custom() {
            if (!this.custom) return null
            return (layout) => this.custom(layout, this.formatData.value)
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