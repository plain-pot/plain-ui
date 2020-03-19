<template>
    <span class="pl-tooltip" :class="{'pl-tooltip-show-overflow-tooltip':showOverflowTooltip}" :tabIndex="trigger === 'focus'?'0':null">
        <slot>{{p_text}}</slot>
    </span>
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";
    import PlainPopper from 'plain-popper'

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
                tooltip: null,
            }
        },
        watch: {
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
            }, {}))
        },
        computed: {
            isShow() {
                if (!this.tooltip) return false
                return this.tooltip.isShow
            },
        },
        methods: {
            show() {
                if (!this.tooltip) {
                    this.initTooltip()
                }
                this.tooltip.show()
            },
            hide() {
                if (!!this.tooltip) {
                    this.tooltip.hide()
                }
            },
            initTooltip() {
                this.tooltip = new PlainTooltip({
                    targetEl: this.$el,
                    content: this.text,
                    gpuAcceleration: false,

                    offset: this.p_offset,
                    placement: this.placement,
                    arrow: this.arrow,
                    boundary: this.boundary,
                    theme: this.theme,
                    animate: this.animate,
                    trigger: this.trigger,
                })
            },
            destroyTooltip() {
                if (!!this.tooltip) {
                    this.tooltip.hide()
                    this.tooltip.destroy()
                    this.tooltip = null
                }
            },
            reset() {
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
        }
    }
</script>

<style lang="scss">
    .pl-tooltip {
        outline: none;
    }
</style>