<template>
    <div class="pl-tag" :class="classes" @click="emitClick">
        <slot>{{p_label}}</slot>
        <pl-icon icon="el-icon-close" v-if="close" class="pl-tag-close" @click.stop="emitClose"/>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-tag",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                label: PropsMixinFactory.Promise,
            }),
            StyleMixin,
            EditMixin,
        ],
        emitters: {
            emitClick: Function,
            emitClose: Function,
        },
        props: {
            mode: {type: String, default: 'stroke'},
            label: {type: String},
            close: {type: Boolean},
        },
        data() {
            return {}
        },
        computed: {
            targetMode() {
                return !!this.plTagInput ? this.plTagInput.mode : this.mode
            },
            classes() {
                return [
                    `pl-tag-status-${this.p_status || 'primary'}`,
                    `pl-tag-mode-${this.targetMode}`,
                    `pl-tag-shape-${this.p_shape || 'fillet'}`,
                    `pl-tag-size-${this.p_size || 'normal'}`,
                    {
                        'pl-tag-disabled': !!this.isDisabled,
                    },
                ]
            },
        },
        methods: {
            onClick(e) {
                if (this.isEditable) {
                    this.emitClick(e)
                }
            },
            onClickClose(e) {
                if (this.isEditable) {
                    this.emitClose(e)
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tag {
            box-sizing: border-box;
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
            border: solid 1px;

            .pl-tag-close {
                margin-left: 3px;
            }

            @include sizeMixin(tag) {
                height: $value;
                line-height: $value;
                padding: 0 #{$value - 20px};
                &.pl-tag-size-mini {
                    font-size: 12px;
                }
                &.pl-tag-size-normal {
                    font-size: 14px;
                }
                &.pl-tag-size-large {
                    font-size: 16px;
                }
            }

            @include shapeMixin(tag) {
                border-radius: $value;
            }

            &.pl-tag-mode-fill {
                @include statusMixin(tag) {
                    color: white;
                    border-color: $value;
                    background-color: $value;
                }

                &.pl-tag-disabled {
                    background-color: $disabled;
                    color: $disabledText;
                    border-color: $disabled;
                }
            }

            &.pl-tag-mode-stroke {
                @include statusMixin(tag) {
                    color: $value;
                    border-color: mix(white, $value, 50%);
                    background-color: mix(white, $value, 90%);
                }

                &.pl-tag-disabled {
                    background-color: $disabled;
                    color: $disabledText;
                    border-color: $disabled;
                }
            }

            &.pl-tag-mode-text {
                @include statusMixin(tag) {
                    color: $value;
                    border-color: transparent;
                }

                &.pl-tag-disabled {
                    color: $disabledText;
                }
            }

            &.pl-tag-disabled {
                cursor: not-allowed;
            }
        }
    }
</style>