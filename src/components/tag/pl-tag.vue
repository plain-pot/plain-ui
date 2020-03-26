<template>
    <div class="pl-tag" :class="classes" @click="onClick">
        <slot>{{p_label}}</slot>
        <pl-icon icon="el-icon-close" v-if="close" class="pl-tag-close" @click.stop="onClickClose"/>
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
        inject: {
            plTagInput: {default: null},
        },
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
            classes() {
                return [
                    `pl-tag-mode-${this.mode}`,
                    `pl-tag-status-${this.p_status || 'primary'}`,
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