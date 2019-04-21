<template>
    <transition :name="`pl-popover-animate-${animate}`">
        <div class="pl-popper" v-show="p_show" :class="classes" :style="styles">
            <pl-scroll :scrollbar-size="6">
                <div class="pl-popper-inner" ref="inner">
                    <div>direction:{{p_direction}}</div>
                    <div>align:{{p_align}}</div>
                </div>
            </pl-scroll>
        </div>
    </transition>
</template>

<script>

    import Popper from 'popper.js'
    import PlScroll from "../pl-scroll";

    const POPOVER_TRIGGER = {
        CLICK: 'click',
        HOVER: 'hover',
    }
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
        components: {PlScroll},
        props: {
            reference: {},
            popper: {},
            direction: {type: String, default: POPOVER_DIRECTION.BOTTOM},           //弹出框的方向：top|bottom|left|right
            align: {type: String, default: POPOVER_ALIGN.START},                    //弹出框的对其方式
            arrow: {type: Boolean},                                                 //弹出框是否带小三角
            offset: {type: Number},                                                 //弹出框与载体的距离
            animate: {type: String, default: 'drop'},                               //弹出框显隐动画
            height: {default: 180},                                                 //弹出框的高度
            width: {default: 180},                                                  //弹出框的宽度
            disabledEqual: {type: Boolean},                                         //弹出框是否与载体在方向上大小相同
            windowBoundary: {type: Boolean, default: true},                         //边界为window
        },
        watch: {
            p_direction() {
                this.p_popper.destroy()
                this.p_initPopper()
            },
            p_align() {
                this.p_popper.destroy()
                this.p_initPopper()
            },
            p_arrow() {
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
                p_arrow: this.arrow,
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
                        'pl-popper-arrow': !!this.p_arrow,
                    },
                    `pl-popper-${this.p_direction}-${this.p_align}`,
                ]
            },
            styles() {
                const ret = {}
                !!this.height && (ret.height = this.$plain.$utils.unit(this.height))
                !!this.width && (ret.width = this.$plain.$utils.unit(this.width))
                return ret
            },
        },
        async mounted() {
            this.parentNode = this.popperEl.parentNode
            this.parentNode.replaceChild(this.p_replace, this.popperEl)
            this.$refs.inner.appendChild(this.popperEl)
            await this.$plain.nextTick()
            this.p_initPopper()
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
                        offset: {offset: `0,${this.offset == null ? this.p_arrow ? 10 : '0' : this.offset}`,},
                        preventOverflow: this.windowBoundary ? {boundariesElement: 'window'} : null,
                        computeStyle: {gpuAcceleration: false},
                    },
                    onUpdate: () => this.p_refresh(),
                    onCreate: () => this.p_refresh(),
                })
            },
        },
    }
</script>

<style lang="scss">
    .pl-popper {
        position: relative;
        transition: .25s cubic-bezier(.24, .22, .015, 1.56);
        transition-property: transform, opacity;
        border-radius: 4px;

        $popper-arrow-size: 6px;
        $popper-back-ground: white;
        $popper-scale-animates: (
                top-start:(
                        transform-origin:bottom left,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:inherit,
                        arrow-bottom:-$popper-arrow-size*2,
                        arrow-left:$popper-arrow-size,
                        arrow-right:inherit,
                        arrow-border-color:$popper-back-ground transparent transparent transparent,
                        box-shadow-x:0,
                        box-shadow-y:-2px,
                ),
                top-center:(
                        transform-origin:bottom center,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:inherit,
                        arrow-bottom:-$popper-arrow-size*2,
                        arrow-left:calc(50% - #{$popper-arrow-size}),
                        arrow-right:inherit,
                        arrow-border-color:$popper-back-ground transparent transparent transparent,
                        box-shadow-x:0,
                        box-shadow-y:-2px,
                ),
                top-end:(
                        transform-origin:bottom right,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:inherit,
                        arrow-bottom:-$popper-arrow-size*2,
                        arrow-left:inherit,
                        arrow-right:$popper-arrow-size,
                        arrow-border-color:$popper-back-ground transparent transparent transparent,
                        box-shadow-x:0,
                        box-shadow-y:-2px,
                ),
                bottom-start:(
                        transform-origin:top left,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:-$popper-arrow-size*2,
                        arrow-bottom:inherit,
                        arrow-left:$popper-arrow-size,
                        arrow-right:inherit,
                        arrow-border-color:transparent transparent $popper-back-ground transparent,
                        box-shadow-x:0,
                        box-shadow-y:2px,
                ),
                bottom-center:(
                        transform-origin:top center,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:-$popper-arrow-size*2,
                        arrow-bottom:inherit,
                        arrow-left:calc(50% - #{$popper-arrow-size}),
                        arrow-right:inherit,
                        arrow-border-color:transparent transparent $popper-back-ground transparent,
                        box-shadow-x:0,
                        box-shadow-y:2px,
                ),
                bottom-end:(
                        transform-origin:top right,
                        active-transform:scaleY(1),
                        inactive-transform:scaleY(0),
                        arrow-top:-$popper-arrow-size*2,
                        arrow-bottom:inherit,
                        arrow-left:inherit,
                        arrow-right:$popper-arrow-size,
                        arrow-border-color:transparent transparent $popper-back-ground transparent,
                        box-shadow-x:0,
                        box-shadow-y:2px,
                ),
                left-start:(
                        transform-origin:right top,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:$popper-arrow-size,
                        arrow-bottom:inherit,
                        arrow-left:inherit,
                        arrow-right:-$popper-arrow-size*2,
                        arrow-border-color:transparent transparent transparent $popper-back-ground,
                        box-shadow-x:-2px,
                        box-shadow-y:0,
                ),
                left-center:(
                        transform-origin:right center,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:calc(50% - #{$popper-arrow-size}),
                        arrow-bottom:inherit,
                        arrow-left:inherit,
                        arrow-right:-$popper-arrow-size*2,
                        arrow-border-color:transparent transparent transparent $popper-back-ground,
                        box-shadow-x:-2px,
                        box-shadow-y:0,
                ),
                left-end:(
                        transform-origin:right bottom,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:inherit,
                        arrow-bottom:$popper-arrow-size,
                        arrow-left:inherit,
                        arrow-right:-$popper-arrow-size*2,
                        arrow-border-color:transparent transparent transparent $popper-back-ground,
                        box-shadow-x:-2px,
                        box-shadow-y:0,
                ),
                right-start:(
                        transform-origin:left top,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:$popper-arrow-size,
                        arrow-bottom:inherit,
                        arrow-left:-$popper-arrow-size*2,
                        arrow-right:inherit,
                        arrow-border-color:transparent $popper-back-ground transparent transparent,
                        box-shadow-x:2px,
                        box-shadow-y:0,
                ),
                right-center:(
                        transform-origin:left center,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:calc(50% - #{$popper-arrow-size}),
                        arrow-bottom:inherit,
                        arrow-left:-$popper-arrow-size*2,
                        arrow-right:inherit,
                        arrow-border-color:transparent $popper-back-ground transparent transparent,
                        box-shadow-x:2px,
                        box-shadow-y:0,
                ),
                right-end:(
                        transform-origin:left bottom,
                        active-transform:scaleX(1),
                        inactive-transform:scaleX(0),
                        arrow-top:inherit,
                        arrow-bottom:$popper-arrow-size,
                        arrow-left:-$popper-arrow-size*2,
                        arrow-right:inherit,
                        arrow-border-color:transparent $popper-back-ground transparent transparent,
                        box-shadow-x:2px,
                        box-shadow-y:0,
                ),
        );

        @each $key, $type in $popper-scale-animates {
            $type-object: map_get($popper-scale-animates, $key);
            background-color: $popper-back-ground;
            &.pl-popper-#{$key} {
                box-shadow: map_get($type-object, box-shadow-x)/2 map_get($type-object, box-shadow-y)/2 3px 0 #ccc;
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
                    .pl-popper-inner {
                        position: relative;
                        &::after {
                            content: " ";
                            position: absolute;
                            border: $popper-arrow-size solid;

                            top: map_get($type-object, arrow-top);
                            bottom: map_get($type-object, arrow-bottom);
                            left: map_get($type-object, arrow-left);
                            right: map_get($type-object, arrow-right);
                            border-color: map_get($type-object, arrow-border-color);
                        }
                    }
                }
            }
        }
    }
</style>