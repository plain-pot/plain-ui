<template>
    <transition :name="`pl-popover-animate-${animate}`">
        <div class="pl-popper" v-show="p_show"></div>
    </transition>
</template>

<script>

    import Popper from 'popper.js'

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
        data() {
            return {
                parentNode: null,
                p_popper: null,

                p_direction: this.direction,
                p_align: this.align,
                p_show: false,
            }
        },
        computed: {
            referenceEl() {
                return !!this.reference.$el ? this.reference.$el : this.reference
            },
            popperEl() {
                return !!this.popper.$el ? this.popper.$el : this.popper
            },
        },
        mounted() {
            this.parentNode = this.popperEl.parentNode
            this.parentNode.removeChild(this.popperEl)
            this.$el.appendChild(this.popperEl)

            this.p_popper = new Popper(this.referenceEl, this.popperEl, {
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
        methods: {
            show() {
                this.p_show = true
            },
            hide() {
                this.p_show = false
            },
            destroy() {
            },
            p_refresh() {
                let placement = this.p_popper.popper.getAttribute('x-placement').split('-');
                this.p_direction = placement[0];
                this.p_align = placement[1];
            },
        },
    }
</script>

<style lang="scss">
    .pl-popper {

    }
</style>