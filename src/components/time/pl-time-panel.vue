<script>
    import {TimePublicProps} from "./subs";
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-time-panel",
        mixins: [
            EmitMixin,
        ],
        emitters: {
            emitInput: Function,
            emitUpdateStart: Function,
            emitUpdateEnd: Function,
        },
        props: {
            value: {type: String},
            start: {type: String},
            end: {type: String},
            range: {type: Boolean},
            ...TimePublicProps,
        },
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
        data() {
            return {
                p_value: this.value,
                p_start: this.start,
                p_end: this.end,
            }
        },
        render(h) {
            const {base, range} = this.bindingProps
            return !this.range ? (
                <pl-time-base-panel class="pl-time-panel" {...base} key="base"/>
            ) : (
                <pl-time-range-panel class="pl-time-panel" {...range} key="range"/>
            )
        },
        computed: {
            bindingProps() {
                const publicProps = Object.keys(TimePublicProps).reduce((ret, key) => {
                    ret[key] = this[key]
                    return ret
                }, {})

                const base = {
                    props: {
                        ...publicProps,
                        value: this.p_value,
                    },
                    on: {
                        change: async (val) => {
                            await this.$plain.nextTick()

                            this.p_value = val
                            this.emitInput(this.p_value)
                        },
                    },
                }

                const range = {
                    props: {
                        ...publicProps,
                        start: this.p_start,
                        end: this.p_end,
                    },
                    on: {
                        change: async (val, type) => {
                            await this.$plain.nextTick()
                            if (type === 'start') {
                                this.p_start = val
                                this.emitUpdateStart(this.p_start)
                            } else if (type === 'end') {
                                this.p_end = val
                                this.emitUpdateEnd(this.p_end)
                            }
                            this.emitInput(val, type)
                        },
                    },
                }

                return {
                    base, range
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>