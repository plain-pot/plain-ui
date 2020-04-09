import {BaseTimePanelProps} from "./index";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: "pl-time-base-panel",
    props: {
        ...BaseTimePanelProps,
    },
    data() {
        return {}
    },
    render(h) {

        let layout = {
            h: <pl-time-base-column layout="h" value={this.formatData.value.hour}/>,
            m: <pl-time-base-column layout="m" value={this.formatData.value.minute}/>,
            s: <pl-time-base-column layout="s" value={this.formatData.value.second}/>,
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
    },
    created() {
        console.log(this.formatData)
    },
    methods: {},
}