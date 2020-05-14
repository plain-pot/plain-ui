<script>
    export default {
        name: "pl-notice-service",
        props: {
            option: {type: Object},
        },
        data() {
            return {
                closeTimer: null,
                onMouseenter: () => {
                    this.$el.removeEventListener('mouseenter', this.onMouseenter)
                    if (!!this.closeTimer) {
                        clearTimeout(this.closeTimer)
                    }
                    this.$el.addEventListener('mouseleave', this.onMouseleave)
                },
                onMouseleave: () => {
                    this.$el.removeEventListener('mouseleave', this.onMouseleave)
                    this.setCloseTimer()
                },
            }
        },
        computed: {
            classes() {
                return [
                    'pl-notice-service',
                    {
                        [`pl-notice-service-status-${this.option.status}`]: !!this.option.status && this.$plain.STATUS[this.option.status]
                    },
                ]
            },
        },
        render(h) {
            return (
                <pl-item class={this.classes}>
                    <div class="pl-notice-service-content" onClick={() => !!this.option.onClick && this.option.onClick()}>
                        <div class="pl-notice-service-head">
                            提示
                        </div>
                        <div class="pl-notice-service-body">
                            {!!this.option.render ? this.option.render(h) : this.option.message}
                        </div>
                        {!this.option.noClose && <pl-button mode="text" icon="el-icon-close" class="pl-notice-service-close" onClick={() => this.close()}/>}
                        {!!this.option.status && this.$plain.STATUS[this.option.status] && <pl-icon icon={this.$plain.STATUS[this.option.status].icon} class="pl-notice-service-status-icon"/>}
                    </div>
                </pl-item>
            )
        },
        mounted() {
            this.setCloseTimer()
        },
        methods: {
            close() {
                this.$emit('close')
            },
            setCloseTimer() {
                let time = this.option.time === undefined ? 3000 : this.option.time
                if (!!time) {
                    this.closeTimer = setTimeout(() => {
                        this.close()
                        this.closeTimer = null
                    }, time)
                    this.$el.addEventListener('mouseenter', this.onMouseenter)
                }
            },
        },
    }
</script>

<style lang="scss">

</style>