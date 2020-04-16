import {DatePublicMixin, DateView} from "./index";
import {EmitMixin} from "../../../utils/mixins";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: 'pl-date-panel-dates',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    data() {
        const {value: p_value} = this
        return {
            p_value,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date/>
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
    },
    methods: {
        getDisabled() {
        },
        getActive(ipd: PlainDate, type: DateView) {
            if (type === DateView.date) {

            }
        },
        getHoverStart() {
        },
        getHover() {
        },
        getHoverEnd() {
        },
    },
}