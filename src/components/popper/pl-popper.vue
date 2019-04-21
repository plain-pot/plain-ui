<template>
    <transition :name="`pl-popover-animate-${animate}`">
        <div class="pl-popper" v-show="p_show" :class="classes" :style="styles">
            <pl-scroll :scrollbar-size="6">
                <div class="pl-popper-inner" ref="inner"></div>
            </pl-scroll>
        </div>
    </transition>
</template>

<script>

    import Popper from 'popper.js'
    import PlScroll from "../pl-scroll";
    import {MountedMixin} from "../../mixin/component-mixin";

    const POPOVER_DIRECTION = {
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right',
    }
    const POPOVER_ALIGN = {
        START: 'start',
        CENTER: 'center',
        END: 'end',
    }

    export default {
        name: "pl-popper",
        mixins: [MountedMixin],
        components: {PlScroll},
        props: {
            reference: {},
            popper: {},
            direction: {type: String, default: POPOVER_DIRECTION.BOTTOM},           //弹出框的方向：top|bottom|left|right
            align: {type: String, default: POPOVER_ALIGN.START},                    //弹出框的对其方式
            arrow: {type: Boolean, default: true},                                  //弹出框是否带小三角
            offset: {type: Number},                                                 //弹出框与载体的距离
            animate: {type: String, default: 'drop'},                               //弹出框显隐动画
            height: {default: 180},                                                 //弹出框的高度
            width: {default: 180},                                                  //弹出框的宽度
            windowBoundary: {type: Boolean, default: true},                         //边界为window
            relate: {type: Array, default: () => []},                               //点击外部元素的时候，relate中数组的元素不会触发关闭动作
            disabledEqual: {type: Boolean},                                         //弹出框是否与载体在方向上大小相同
            disabledHideOnClickOutside: {type: Boolean},                            //禁用点击外部的时候关闭
        },
        watch: {
            direction(val) {
                this.p_direction = val
                this.p_popper.destroy()
                this.p_initPopper()
            },
            align(val) {
                this.p_align = val
                this.p_popper.destroy()
                this.p_initPopper()
            },
            arrow() {
                this.p_popper.destroy()
                this.p_initPopper()
            },
        },
        data() {
            return {
                parentNode: null,
                p_popper: null,

                p_direction: this.direction,
                p_align: this.align,
                p_show: false,
                p_replace: document.createComment('')
            }
        },
        computed: {
            referenceEl() {
                return !!this.reference.$el ? this.reference.$el : this.reference
            },
            popperEl() {
                return !!this.popper.$el ? this.popper.$el : this.popper
            },
            classes() {
                return [
                    {
                        'pl-popper-arrow': !!this.arrow,
                    },
                    `pl-popper-${this.p_direction}-${this.p_align}`,
                ]
            },
            styles() {
                const ret = {}
                !!this.height && (ret.height = this.$plain.$utils.unit(this.height))
                !!this.width && (ret.width = this.$plain.$utils.unit(this.width))
                if (!this.disabledEqual && this.p_mounted) ret[this.p_vertical ? 'width' : 'height'] = `${this.referenceEl[this.p_vertical ? 'offsetWidth' : 'offsetHeight']}px`
                return ret
            },
            p_vertical() {
                return this.$plain.$utils.oneOf(this.p_direction, ['top', 'bottom'])
            },
            p_relate() {
                return [this.referenceEl, this.popperEl, ...(this.relate || [])]
            },
        },
        async mounted() {
            this.parentNode = this.popperEl.parentNode
            this.parentNode.replaceChild(this.p_replace, this.popperEl)
            this.$refs.inner.appendChild(this.popperEl)
            await this.$plain.nextTick()
            this.p_initPopper()
            window.addEventListener('click', this.p_clickWindow)
        },
        methods: {
            async show() {
                this.p_show = true
                await this.$plain.nextTick()
                this.p_popper.update()
            },
            async hide() {
                this.p_show = false
                await this.$plain.nextTick()
            },
            destroy() {
                this.parentNode.replaceChild(this.popperEl, this.p_replace)
                this.p_popper.destroy()
            },
            p_refresh() {
                let placement = this.p_popper.popper.getAttribute('x-placement').split('-');
                this.p_direction = placement[0];
                this.p_align = placement[1];
            },
            p_initPopper() {
                this.p_popper = new Popper(this.referenceEl, this.$el, {
                    placement: `${this.p_direction}-${this.p_align}`,
                    modifiers: {
                        offset: {offset: `0,${this.offset == null ? this.arrow ? 10 : '0' : this.offset}`,},
                        preventOverflow: this.windowBoundary ? {boundariesElement: 'window'} : null,
                        computeStyle: {gpuAcceleration: false},
                    },
                    onUpdate: () => this.p_refresh(),
                    onCreate: () => this.p_refresh(),
                })
            },
            async p_clickWindow(e) {
                if (!this.disabledHideOnClickOutside && !this.p_relate.some(el => el.contains(e.target))) this.hide()
            },
        },
        beforeDestroy() {
            window.removeEventListener('click', this.p_clickWindow)
        },
    }
</script>

<style lang="scss">
    .pl-popper {
        position: relative;
        transition: .25s cubic-bezier(.24, .22, .015, 1.56);
        transition-property: transform, opacity;
        border-radius: 4px;
        z-index: 99999;

        $popper-arrow-size: 6px;
        $popper-back-ground: white;
        $popper-scale-animates: (
                top-start:(
                        transform-origin:bottom left,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'bottom',
                        align:'left',
                        alignValue:16px,
                        zeroWidth:'border-bottom-width',
                        borderColor:'border-top-color',
                ),
                top-center:(
                        transform-origin:bottom center,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'bottom',
                        align:'left',
                        alignValue:calc(50% - #{$popper-arrow-size/2}),
                        zeroWidth:'border-bottom-width',
                        borderColor:'border-top-color',
                ),
                top-end:(
                        transform-origin:bottom right,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'bottom',
                        align:'right',
                        alignValue:16px,
                        zeroWidth:'border-bottom-width',
                        borderColor:'border-top-color',
                ),
                bottom-start:(
                        transform-origin:top left,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'top',
                        align:'left',
                        alignValue:16px,
                        zeroWidth:'border-top-width',
                        borderColor:'border-bottom-color',
                ),
                bottom-center:(
                        transform-origin:top center,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'top',
                        align:'left',
                        alignValue:calc(50% - #{$popper-arrow-size/2}),
                        zeroWidth:'border-top-width',
                        borderColor:'border-bottom-color',
                ),
                bottom-end:(
                        transform-origin:top right,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        direction:'top',
                        align:'right',
                        alignValue:16px,
                        zeroWidth:'border-top-width',
                        borderColor:'border-bottom-color',
                ),
                left-start:(
                        transform-origin:right top,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'right',
                        align:'top',
                        alignValue:16px,
                        zeroWidth:'border-right-width',
                        borderColor:'border-left-color',
                ),
                left-center:(
                        transform-origin:right center,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'right',
                        align:'top',
                        alignValue:calc(50% - #{$popper-arrow-size/2}),
                        zeroWidth:'border-right-width',
                        borderColor:'border-left-color',
                ),
                left-end:(
                        transform-origin:right bottom,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'right',
                        align:'bottom',
                        alignValue:16px,
                        zeroWidth:'border-right-width',
                        borderColor:'border-left-color',
                ),
                right-start:(
                        transform-origin:left top,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'left',
                        align:'top',
                        alignValue:16px,
                        zeroWidth:'border-left-width',
                        borderColor:'border-right-color',
                ),
                right-center:(
                        transform-origin:left center,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'left',
                        align:'top',
                        alignValue:calc(50% - #{$popper-arrow-size/2}),
                        zeroWidth:'border-left-width',
                        borderColor:'border-right-color',
                ),
                right-end:(
                        transform-origin:left bottom,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        direction:'left',
                        align:'bottom',
                        alignValue:16px,
                        zeroWidth:'border-left-width',
                        borderColor:'border-right-color',
                ),
        );

        @each $key, $type in $popper-scale-animates {
            $type-object: map_get($popper-scale-animates, $key);
            background-color: $popper-back-ground;
            &.pl-popper-#{$key} {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                border: 1px solid #e4e7ed;
                border-radius: 4px;
                transform-origin: map_get($type-object, transform-origin);
                &.pl-popover-animate-drop-enter-active, &.pl-popover-animate-drop-leave-active {
                    transform: map_get($type-object, active-transform);
                    opacity: 1;
                }
                &.pl-popover-animate-drop-enter, &.pl-popover-animate-drop-leave-to {
                    transform: map_get($type-object, inactive-transform);
                    opacity: 0;
                }
                &.pl-popover-animate-scale-enter-active, &.pl-popover-animate-scale-leave-active {
                    transform: scale(1);
                    opacity: 1;
                }
                &.pl-popover-animate-scale-enter, &.pl-popover-animate-scale-leave-to {
                    transform: scale(0.6);
                    opacity: 0;
                }
                &.pl-popper-arrow {
                    &::after {
                        border: $popper-arrow-size solid transparent;
                        content: '';
                        position: absolute;
                        display: block;
                        width: 0;
                        height: 0;

                        #{map_get($type-object, direction)}: -6px;
                        #{map_get($type-object, align)}: #{map_get($type-object, alignValue)};
                        #{map_get($type-object, zeroWidth)}: 0;
                        #{map_get($type-object, borderColor)}: white;
                    }
                }
            }
        }
    }
</style>