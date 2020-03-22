<script>

    const DEFAULT_OPTS = {
        reference: null,
        $slots: null,
        render: null
    }

    export default {
        name: "pl-popper-service-item",
        props: {},
        data() {
            return {
                opts: null,
                showFlag: false,
                openFlag: false,
            }
        },
        computed: {
            p_opts() {
                if (!this.opts) return null
                return Object.assign({}, DEFAULT_OPTS, this.opts)
            },
            popperBinding() {
                return {
                    props: {
                        value: this.showFlag,
                        open: this.openFlag,
                        trigger: 'manual',
                        transition: 'pl-transition-scale'
                    },
                    on: {
                        input: (val) => {
                            this.showFlag = val
                        },
                        ['update:open']: (val) => {
                            this.openFlag = val
                        },
                    },
                }
            },
        },
        render(h) {
            if (!this.p_opts) return null
            return (
                <pl-popper class="pl-popper-service-item"
                           reference={this.p_opts.reference}
                           {...this.popperBinding}>
                    <div slot="popper" class="pl-popper-service-item-content" style="height:100px;width:200px">
                        {!!this.p_opts.$slots && this.p_opts.$slots}
                        {!!this.p_opts.render && this.p_opts.render(h)}
                    </div>
                </pl-popper>
            )
        },
        methods: {
            async show(opts) {
                this.opts = opts
                await this.$plain.nextTick()
                this.showFlag = true
            },
        },
    }
</script>

<style lang="scss">
</style>