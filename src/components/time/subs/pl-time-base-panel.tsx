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
            h: <pl-time-base-column layout="h" value={this.formatData.value.hour} onChange={val => this.onColumnChange(val, 'h')}/>,
            m: <pl-time-base-column layout="m" value={this.formatData.value.minute} onChange={val => this.onColumnChange(val, 'm')}/>,
            s: <pl-time-base-column layout="s" value={this.formatData.value.second} onChange={val => this.onColumnChange(val, 's')}/>,
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
    methods: {
        onColumnChange(value, type) {
            const pd = this.formatData.value as PlainDate
            switch (type) {
                case 'h':
                    pd.setHour(value)
                    break
                case 'm':
                    pd.setMinute(value)
                    break
                case 's':
                    pd.setSecond(value)
                    break
            }
            this.emitInput(pd.valueString)
        },
    },
}