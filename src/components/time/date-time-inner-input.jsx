import {EditMixin, EmitMixin, PropsMixinFactory, RefsMixinFactory} from "../../utils/mixins";

export const PlDatetimeInputInner = {
    name: 'pl-datetime-input-inner',
    mixins: [
        EmitMixin,
        EditMixin,
        RefsMixinFactory({
            input: Object
        }),
        PropsMixinFactory.create({
            width: PropsMixinFactory.Number
        })
    ],
    emitters: {
        emitInput: Function,
        emitBlur: Function,
        emitFocus: Function,
    },
    props: {
        width: {type: [String, Number], default: 138},
        value: {type: String},

        displayFormat: {type: String},
    },
    watch: {
        value(val) {
            this.p_value = val
        },
    },
    data() {
        return {
            p_value: this.value,
        }
    },
    render(h) {
        return (
            <input type="text"
                   ref="input"
                   class="pl-date-time-inner-input pl-input-custom-inner-input"
                   style={this.styles}
                   value={this.p_value}
                   onInput={this.onInput}
                   onBlur={this.onBlur}
                   onFocus={this.onFocus}
                   disabled={this.isDisabled}
                   readOnly={this.isReadonly}
            />
        )
    },
    computed: {
        styles() {
            return {
                width: this.$plain.utils.suffixPx(this.p_width)
            }
        },
        regexp() {
            return new RegExp('^' + this.displayFormat.replace(/[a-zA-Z]/g, '\\d') + '$')
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        focus() {
            this.input.focus()
        },
        /*---------------------------------------handler-------------------------------------------*/
        onInput(e) {
            this.p_value = e.target.value
            if (!this.p_value) {
                this.emitInput(this.p_value)
                return
            }
            if (!this.regexp.test(this.p_value)) {
                return
            }
            this.emitInput(this.p_value)
        },
        onBlur(e) {
            this.p_value = this.value
            this.emitBlur(e)
        },
        onFocus(e) {
            this.emitFocus(e)
        },
    }
}

