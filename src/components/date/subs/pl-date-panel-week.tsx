import {DatePublicMixin} from "./index";
import {PlainDate} from "../../../utils/PlainDate";

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

        return {
            p_value,
            p_start,
            p_end,

            hoverRange,
            valueRange,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date class="pl-date-panel-week"/>
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
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getActive() {

        },
        getHoverStart() {

        },
        getHover() {

        },
        getHoverEnd() {

        },
        /*---------------------------------------handler-------------------------------------------*/

    },
}