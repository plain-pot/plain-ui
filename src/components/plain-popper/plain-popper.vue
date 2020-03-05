<script>

    import PlainPopper from 'plain-popper'

    let popperWrapper = null;

    export default {
        name: "plain-popper",
        props: {
            component: {type: Object},
            componentBinding: {type: Object},

            placement: {type: String, default: 'top-start'},            // 位置
            offset: {type: Number},                                     // 偏移量
            arrow: {type: Boolean, default: true},                      // 是否需要箭头
            boundary: {default: 'window'},                              // 边界元素
        },
        data() {
            return {
                popperContent: null,
                popper: null,
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
                    {
                        render: () => (
                            <div>
                                <div class="plain-popper-content">
                                    {!!this.arrow && <div class="plain-popper-arrow"/>}
                                    {this.$slots.default}
                                </div>
                            </div>
                        )
                    },
                    {parent: popperWrapper, parentNode: popperWrapper.$el}
                )

                this.popper = new PlainPopper({
                    popperEl: this.popperContent.$el,
                    targetEl: this.$el,
                    arrow: this.arrow,
                    placement: this.placement,
                    offset: this.offset,
                    boundary: this.boundary,
                    boxShadow: null,
                })
            },
        },
        mounted() {
            this.checkPopperWrapper()
            this.initialize()
        },
        beforeDestroy() {
            this.popperContent.$destroy()
            this.popperContent.$el.parentNode.removeChild(this.popperContent.$el)
        },
    }
</script>

<style lang="scss">
</style>