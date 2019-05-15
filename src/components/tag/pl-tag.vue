<template>
    <div class="pl-tag" :class="classes" @click="e=>!disabled && !readonly &&$emit('click',e)">
        <slot>
            <span>{{label}}</span>
        </slot>
        <pl-icon icon="pad-close-circle-fill" v-if="close" hover class="pl-tag-close" @click.stop="e=>!disabled && !readonly && $emit('close',e)"/>
    </div>
</template>

<script>
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-tag",
        components: {PlIcon},
        props: {
            color: {type: String, default: 'info'},
            size: {type: String, default: 'small'},
            label: {type: String,},
            close: {type: Boolean},
            disabled: {type: Boolean},
            readonly: {type: Boolean},
        },
        computed: {
            classes() {
                return [
                    `pl-tag-color-${this.color}`,
                    `pl-tag-size-${this.size}`,
                    {
                        'pl-tag-disabled': this.disabled
                    },
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-tag {
            border: solid 1px;
            box-sizing: border-box;
            font-size: 12px;
            border-radius: plVar(borderFillet);
            cursor: pointer;
            user-select: none;
            display: inline-flex;
            align-items: center;

            .pl-tag-close {
                margin-left: 3px;
            }

            @include plColors {
                &.pl-tag-color-#{$key} {
                    background-color: $colorLighter;
                    border-color: $color;
                    color: $colorDeep;

                    &:active {
                        background-color: $colorLight;
                    }
                }
            }

            @include plSizes {
                &.pl-tag-size-#{$key} {
                    height: $value;
                    padding: 0 #{$value - 16px};
                }
            }

            &.pl-tag-disabled {
                cursor: not-allowed;
                color: plVar(colorDisabled);
            }
        }
    }
</style>