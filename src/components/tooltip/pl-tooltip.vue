<template>
    <span class="pl-tooltip" :class="{'pl-tooltip-show-overflow-tooltip':showOverflowTooltip}" :tabIndex="trigger === 'focus'?'0':null">
        <slot>{{p_text}}</slot>&nbsp;&nbsp;
    </span>
</template>

<script lang="ts">
    import {PropsMixinFactory} from "../../utils/mixins";
    // @ts-ignore
    import PlainPopper from "plain-popper"

    const PlainTooltip = PlainPopper.PlainTooltip

    export default {
        name: "pl-tooltip",
        mixins: [
            PropsMixinFactory.create({
                text: PropsMixinFactory.Promise,
                offset: PropsMixinFactory.Number,
            })
        ],
        props: {
            text: {type: [String, Object]},
            showOverflowTooltip: {type: Boolean},

            // popper
            offset: {type: [Number, String]},                           // 偏移量
            placement: {type: String, default: 'top'},                  // 位置
            arrow: {type: Boolean, default: true},                      // 是否需要箭头
            boundary: {default: 'window'},                              // 边界元素

            // tooltip
            theme: {type: String},                                      // 主题 dark,light
            animate: {type: String},                                    // 动画 drop,scale,fade
            trigger: {type: String, default: 'hover'},                  // 触发方式 click,hover,focus,manual,always
        },
        data() {
            return {
                tooltip: null,                                          // plainTooltip实例
                unwatch: null,                                          // $watch 的取消监听函数
            }
        },
        watch: {
            /**
             * 监听一下变量的变化重新创建tooltip对象
             * @author  韦胜健
             * @date    2020/3/19 15:29
             */
            ...([
                'text',
                'offset',
                'placement',
                'arrow',
                'boundary',
                'theme',
                'animate',
                'trigger',
            ].reduce((ret, propsName) => {
                ret[propsName] = function () {
                    this.reset()
                }
                return ret
            }, {})),
            /**
             * showOverflowTooltip 开启则监听 text的变化，当内容宽度大于容器宽度时初始化 tooltip实例，否则销毁实例
             * @author  韦胜健
             * @date    2020/3/19 15:30
             */
            showOverflowTooltip: {
                immediate: true,
                async handler(val) {
                    if (val) {
                        this.unwatch = this.$watch('text', {
                            immediate: true,
                            async handler() {
                                await this.$plain.nextTick()
                                const {offsetWidth, scrollWidth} = this.$el
                                if (offsetWidth >= scrollWidth) {
                                    if (!!this.tooltip) {
                                        this.destroyTooltip()
                                    }
                                } else {
                                    if (!this.tooltip) {
                                        this.initTooltip()
                                    }
                                }
                            },
                        })
                    } else {
                        !!this.unwatch && this.unwatch()
                    }
                },
            },
        },
        computed: {
            /**
             * 当前 tooltip 是否已经显示
             * @author  韦胜健
             * @date    2020/3/19 15:30
             */
            isShow(): boolean {
                if (!this.tooltip) return false
                return this.tooltip.isShow
            },
        },
        methods: {
            /**
             * tooltip显示
             * @author  韦胜健
             * @date    2020/3/19 15:30
             */
            show(): void {
                if (!this.tooltip) {
                    this.initTooltip()
                }
                this.tooltip.show()
            },
            /**
             * tooltip关闭
             * @author  韦胜健
             * @date    2020/3/19 15:30
             */
            hide(): void {
                if (!!this.tooltip) {
                    this.tooltip.hide()
                }
            },
            /**
             * 初始化 tooltip 实例对象
             * @author  韦胜健
             * @date    2020/3/19 15:30
             */
            initTooltip(): void {
                this.tooltip = new PlainTooltip({
                    targetEl: this.$el,
                    content: this.text,

                    offset: this.p_offset,
                    placement: this.placement,
                    arrow: this.arrow,
                    boundary: this.boundary,
                    theme: this.theme,
                    animate: this.animate,
                    trigger: this.trigger,
                })
            },
            /**
             * 销毁 tooltip实例对象
             * @author  韦胜健
             * @date    2020/3/19 15:31
             */
            destroyTooltip(): void {
                if (!!this.tooltip) {
                    this.tooltip.hide()
                    this.tooltip.destroy()
                    this.tooltip = null
                }
            },
            /**
             * 重新初始化 tooltip实例对象
             * @author  韦胜健
             * @date    2020/3/19 15:31
             */
            reset(): void {
                if (!!this.tooltip) {
                    this.destroyTooltip()
                }
                this.initTooltip()
            },
        },
        mounted() {
            this.initTooltip()
        },
        beforeDestroy() {
            this.destroyTooltip()
            !!this.unwatch && this.unwatch()
        }
    }
</script>

<style lang="scss">
    .pl-tooltip {
        outline: none;

        &.pl-tooltip-show-overflow-tooltip {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            vertical-align: text-bottom;
        }
    }
</style>