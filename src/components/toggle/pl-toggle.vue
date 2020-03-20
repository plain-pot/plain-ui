<template>
    <div
            class="pl-toggle plain-click-node"
            tabindex="0"
            :class="classes"
            @mousedown="onMousedown"
            @click="onClick"
            @keydown.space.prevent="onClick"
            @keydown.enter.prevent="onClick"
            v-click-wave="'large'">
        <div class="pl-toggle-inner"/>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, StyleMixin} from "../../utils/mixins";
    import ClickWave from "../../directives/ClickWave";

    export default {
        name: "pl-toggle",
        directives: {ClickWave},
        mixins: [
            EmitMixin,
            EditMixin,
            StyleMixin,
        ],
        emitters: {
            emitInput: Function,
            emitMouseup: Function,
            emitMousedown: Function,
            emitClick: Function,
            emitFocus: Function,
            emitBlur: Function,
        },
        props: {
            value: {},                                                              // 双向绑定值
            trueValue: {default: true},                                             // 选中时绑定的值
            falseValue: {default: false},                                           // 未选中时绑定的值
        },
        data() {
            return {
                isActive: false,                                                    // 当前是否鼠标点击
                p_value: this.value,

                onMousedown: (e) => {
                    this.isActive = true
                    window.addEventListener('mouseup', this.onMouseup)
                    this.emitMousedown(e)
                },
                onMouseup: (e) => {
                    this.isActive = false
                    window.removeEventListener('mouseup', this.onMouseup)
                    this.emitMouseup(e)
                },
            }
        },
        computed: {
            isChecked() {
                return this.p_value === this.trueValue
            },
            classes() {
                return [
                    `pl-toggle-status-${this.status || 'primary'}`,
                    `pl-toggle-size-${this.size || 'normal'}`,
                    {
                        'pl-toggle-on': !!this.isChecked,
                        'pl-toggle-active': !!this.isActive,
                        'pl-toggle-disabled': this.isDisabled,
                    },
                ]
            },
        },
        methods: {
            onClick(e) {
                this.p_value = this.isChecked ? this.falseValue : this.trueValue
                this.emitInput(this.p_value)
                this.emitClick(e)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-toggle {
            background-color: #ddd;
            position: relative;
            outline: none;
            display: inline-block;
            vertical-align: middle;
            user-select: none;
            transition: background-color 300ms;
            cursor: pointer;

            .pl-toggle-inner {
                content: '';
                position: absolute;
                left: 2px;
                top: 2px;
                bottom: 2px;
                background: white;
                box-shadow: 0 3px 12px rgba(0, 0, 0, .16), 0 3px 1px rgba(0, 0, 0, .1);
                transition: all 0.3s;
                border-radius: plvar(sizeLarge);
            }

            &:before {
                position: absolute;
                left: 2px;
                right: 2px;
                top: 2px;
                bottom: 2px;
                border-radius: plvar(sizeLarge);
                background-color: #fff;
                content: "";
                transform: scaleX(1);
                /*transform: scale3d(0, 0, 0);*/
                transition: transform .3s;
            }

            @include sizeMixin(toggle) {
                height: $value;
                width: $value*52/32;
                border-radius: plvar(sizeLarge);

                &.pl-toggle-on {
                    .pl-toggle-inner {
                        left: $value/2+6;
                    }
                }
                .pl-toggle-inner {
                    right: $value/2+6;
                }

                &.pl-toggle-active {
                    .pl-toggle-inner {
                        right: $value/2;
                    }

                    &.pl-toggle-on .pl-toggle-inner {
                        left: $value/2;
                    }
                }
            }

            &.pl-toggle-on {
                &:before {
                    transform: scale3d(0, 0, 0);
                }

                .pl-toggle-inner {
                    right: 2px;
                }
            }

            &.pl-toggle-active {
                .pl-toggle-inner {
                    left: 2px;
                }

                &.pl-toggle-on .pl-toggle-inner {
                    right: 2px;
                }
            }

            @include statusMixin(toggle) {
                &.pl-toggle-on {
                    background-color: $value;
                }
            }

            &.pl-toggle-disabled {
                background-color: $disabled !important;

                &::before {
                    background-color: $disabledText !important;
                }
            }
        }
    }
</style>