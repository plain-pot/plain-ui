<template>
    <div class="pl-tooltip"
         :class="{'pl-tooltip-show-overflow-tooltip':showOverflowTooltip}"
         @mouseenter="p_mouseenter"
         @mouseleave="p_mouseleave">
        <div ref="content" class="pl-tooltip-content">
            <slot>{{content}}</slot>
        </div>
    </div>
</template>

<script>

    import Tippy from 'tippy.js';

    export default {
        name: "pl-tooltip",
        props: {
            content: {required: true},                                      //显示以及tooltip悬浮显示的文本
            showOverflowTooltip: {type: Boolean, default: false},           //内容超长时才会显示

            arrow: {type: Boolean, default: true},                          //是否显示箭头
            placement: {type: String, default: 'top'},                      //悬浮位置
            trigger: {type: String, default: 'manual'},                     //悬浮触发方式
            theme: {type: String, default: 'dark'},                         //悬浮的主题色
            boundary: {default: 'window'},                                  //边界元素
            disabled: {type: Boolean},                                      //是否禁用
        },
        watch: {
            disabled: {
                immediate: true,
                handler(val) {
                    if (!val && !this.tippy) {
                        this.$nextTick(() => {
                            Tippy(this.$el, this.tooltipOption)
                            this.tippy = this.$el._tippy
                        })
                    } else if (!!val && !!this.tippy) {
                        this.tippy.hide(0)
                        this.tippy.destroy(true)
                    }
                },
            },
            content(val) {
                if (!val) {
                    // this.tippy.hide()
                    // this.tippy.destroy()
                } else {
                    this.tippy.set(this.tooltipOption)
                }
            },
        },
        data() {
            return {
                tippy: null,
                p_show: false,
            }
        },
        computed: {
            tooltipOption() {
                return {
                    content: this.content,
                    arrow: this.arrow,
                    placement: this.placement,
                    trigger: this.trigger,
                    theme: this.theme,
                    boundary: this.boundary
                }
            },
        },
        methods: {
            p_mouseenter() {
                // console.log(this.disabled || !this.content || this.p_show)
                if (this.disabled || !this.content || this.p_show) return
                const next = () => {
                    this.tippy.show()
                    this.p_show = true
                }
                if (!this.showOverflowTooltip) {
                    next()
                } else {
                    if (!this.$el || !this.$refs.content) return
                    const hostWidth = this.$el.offsetWidth
                    const contentWidth = this.$refs.content.offsetWidth
                    if (contentWidth > hostWidth) {
                        next()
                    }
                }
            },
            p_mouseleave() {
                if (this.disabled || !this.content || !this.p_show) return
                this.tippy.hide()
                this.p_show = false
            },
        },
    }
</script>