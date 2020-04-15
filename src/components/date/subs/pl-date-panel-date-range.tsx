import {DatePublicMixin} from "./index";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: 'pl-date-panel-date-range',
    mixins: [
        DatePublicMixin,
    ],
    data() {
        return {}
    },
    render(h) {
        return (
            <div class="pl-date-base-panel pl-date-panel-date-range">
                <pl-date-base-panel-date/>
                <pl-date-base-panel-date/>
            </div>
        )
    },
    methods: {
        getActive(ipd: PlainDate | number, type: DataView) {
        },
        getHoverStart(ipd: PlainDate | number, type: DataView) {
        },
        getHover(ipd: PlainDate | number, type: DataView) {
        },
        getHoverEnd(ipd: PlainDate | number, type: DataView) {
        },
    },
}