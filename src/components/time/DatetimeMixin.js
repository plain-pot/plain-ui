import {AgentMixin} from "../service/service";
import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
import {PlDatetimeInputInner} from "./date-time-inner-input";

export default {
    components: {PlDatetimeInputInner},
    mixins: [
        AgentMixin,
        EmitMixin,
        EditMixin,
        RefsMixinFactory({
            valueInput: Object,
            startInput: Object,
            endInput: Object,
            plInput: Object,
        }),
    ],
    watch: {
        value(val) {
            this.p_value = val
        },
        start(val) {
            this.p_start = val
        },
        end(val) {
            this.p_end = val
        },
    },
    computed: {
        inputValue() {
            return !this.range ? this.p_value : ((this.p_start || '') + (this.p_end || ''))
        },
    },
    methods: {
        clearHandler() {
            if (!this.range) {
                this.p_value = null
                this.emitInput(this.p_value)
            } else {
                this.p_start = null
                this.p_end = null
                this.emitUpdateStart(this.p_start)
                this.emitUpdateEnd(this.p_end)
            }
        },
        onClickInput() {
            if (!this.range) {
                this.toggle()
            } else {
                this.show()
            }
        },
        onCustomInnerInputFocus(e) {
            this.onFocus(e)
        },
        async onCustomInnerInputBlur(e) {
            if (!this.range) {
                this.onBlur(e)
            } else {
                await this.$plain.utils.delay(0)
                if ([
                    this.startInput.$el,
                    this.endInput.$el,
                ].indexOf(document.activeElement) === -1) {
                    this.focusCounter--
                    if (this.focusCounter === 0) {
                        this.emitBlur()
                        this.hide()
                    }
                }
            }
        },
    },
}