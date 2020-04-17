import {DatePublicMixin, DateView} from "./index";
import {EmitMixin} from "../../../utils/mixins";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: 'pl-date-panel-dates',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    emitters: {
        emitInput: Function,
    },
    data() {
        const {value: p_value} = this
        return {
            p_value,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date {...this.datePanelBinding}/>
        )
    },
    computed: {
        formatData() {
            const {displayFormat, valueFormat} = this.formatString
            let {p_value: value, max, min} = this
            value = value || []
            value = value.map(item => new PlainDate(item, displayFormat, valueFormat))

            max = new PlainDate(max, displayFormat, valueFormat)
            min = new PlainDate(max, displayFormat, valueFormat)

            return {
                value,
                max,
                min,
            }
        },
        datePanelBinding() {
            return {
                props: {
                    max: this.max,
                    min: this.min,
                },
                on: {
                    'click-item': this.onClickItem
                },
            }
        },
    },
    methods: {
        getChildActive(ipd: PlainDate, type: DateView) {
            const {value} = this.formatData

            if (type === DateView.year) {
                return !!this.$plain.utils.findOne(value, item => item.Y === ipd)
            } else if (type === DateView.month) {
                return !!this.$plain.utils.findOne(value, item => item.YM === ipd.YM)
            } else if (type === DateView.date) {
                return !!this.$plain.utils.findOne(value, item => item.YMD === ipd.YMD)
            }
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(ipd: PlainDate) {

            const {value} = this.formatData

            const ret = this.$plain.utils.findOne(value, item => item.YMD === ipd.YMD, true)
            if (!!ret) {
                value.splice(ret.index, 1)
            } else {
                value.push(ipd)
            }

            this.p_value = value.map(item => item.valueString)
            this.emitInput(this.p_value)
        },
    },
}