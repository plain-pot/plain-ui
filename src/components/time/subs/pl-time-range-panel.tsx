import {TimePublicProps} from "./index";
import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-time-range-panel',
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
        emitInput: Function,
    },
    props: {
        start: {type: String},
        end: {type: String},
        ...TimePublicProps,
    },
    watch: {
        start(val) {
            this.p_start = val
        },
        end(val) {
            this.p_end = val
        },
    },
    data() {
        return {
            p_start: this.start,
            p_end: this.end,
        }
    },
    render(h) {

        const publicProps = Object.keys(TimePublicProps).reduce((ret, key) => {
            ret[key] = this.key
            return ret
        }, {})

        const startBinding = {
            props: {
                value: this.p_start,
                ...publicProps,
            },
            on: {
                change: (value) => {
                    this.emitUpdateStart(value)
                    this.emitInput(value, 'start')
                }
            }
        }
        const endBinding = {
            props: {
                value: this.p_end,
                ...publicProps,
            },
            on: {
                change: (value) => {
                    this.emitUpdateEnd(value)
                    this.emitInput(value, 'end')
                }
            }
        }

        return (
            <div class="pl-time-range-panel">
                <pl-time-base-panel {...startBinding}/>
                <pl-time-base-panel {...endBinding}/>
            </div>
        )
    },
}