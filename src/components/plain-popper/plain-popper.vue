<script>

    let popperWrapper = null;

    export default {
        name: "plain-popper",
        props: {
            component: {type: Object},
            componentBinding: {type: Object},
        },
        data() {
            return {
                popperContent: null,
            }
        },
        render(h) {
            return h(
                'component',
                {
                    ...this.componentBinding,
                    class: 'plain-popper-target',
                    is: this.component,
                },
            )
        },
        computed: {},
        methods: {
            /**
             * 检查 popperWrapper是否已经初始化
             * @author  韦胜健
             * @date    2020/3/5 12:04
             */
            checkPopperWrapper() {
                if (!popperWrapper) popperWrapper = this.$plain.newInstance('plain-popper-wrapper', {parent: this})
            },
            /**
             * 初始化
             * @author  韦胜健
             * @date    2020/3/5 12:05
             */
            initialize() {
                /* 初始化 popperContent */
                this.popperContent = this.$plain.newInstance(
                    {render: () => <div className="plain-popper-content">{this.$slots.default}</div>},
                    {parent: popperWrapper, parentNode: popperWrapper.$el}
                )
            },
        },
        mounted() {
            this.checkPopperWrapper()
            this.initialize()
        }
    }
</script>

<style lang="scss">
</style>