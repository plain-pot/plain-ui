<script>
    export default {
        name: "pl-notice-service",
        props: {
            option: {type: Object},
        },
        data() {
            return {}
        },
        render(h) {
            return (
                <pl-item class="pl-notice-service">
                    <div class="pl-notice-service-content">
                        <div class="pl-notice-service-head">
                            提示
                        </div>
                        <div class="pl-notice-service-body">
                            {!!this.option.render ? this.option.render(h) : this.option.message}
                        </div>
                        <pl-button mode="text" icon="el-icon-close" class="pl-notice-service-close" onClick={() => this.close()}/>
                    </div>
                </pl-item>
            )
        },
        created() {
            let time = this.option.time === undefined ? 3000 : this.option.time
            if (!!time) {
                setTimeout(() => this.close(), time)
            }
        },
        methods: {
            close() {
                this.$emit('close')
            },
        },
    }
</script>

<style lang="scss">

</style>