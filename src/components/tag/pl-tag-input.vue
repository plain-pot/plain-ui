<template>
    <button class="pl-tag-input" :class="classes" :style="{width:width}" @mouseenter="pl_mouseenter" @mouseleave="pl_mouseleave">
        <div class="pl-tag-input-content">
            <pl-tag v-for="(item,index) in p_value" :key="index" :label="item" close @close="pl_close(item,index)" :disabled="p_disabled" :readonly="p_readonly"/>
            <input type="text" class="pl-tag-input-el" v-if="input" @keyup.enter.prevent="pl_enter" v-model="p_text" :disabled="p_disabled" :readonly="p_readonly">
        </div>
        <pl-icon icon="pad-close-circle-fill" v-if="!p_disabled&&!p_readonly&&p_hover&&!!icon&&!!p_value.join('')" class="pl-tag-input-clear-icon" @click="pl_clear"/>
        <pl-icon :icon="icon" v-else-if="icon"/>
        <pl-edit-control ref="edit" v-bind="editBinding" v-on="editListening" :value="p_value.join('')"/>
    </button>
</template>

<script>
    import PlTag from "./pl-tag";
    import PlEditControl from "../form/pl-edit-control";
    import {EditMixin} from "../../mixin/component-mixin";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-tag-input",
        components: {PlIcon, PlEditControl, PlTag},
        mixins: [EditMixin],
        props: {
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            value: {type: Array, default: () => []},
            close: {type: Boolean, default: true},
            width: {type: String, default: '200px'},
            icon: {type: String, default: 'pad-tag'},
            input: {type: Boolean},
            onCreate: {type: Function},
            onRemove: {type: Function},
        },
        data() {
            return {
                p_focus: false,
                p_value: [...(this.value || [])],
                p_text: null,
                p_hover: false,
            }
        },
        watch: {
            value(val) {
                this.p_value = [...(val || [])]
            },
        },
        computed: {
            classes() {
                return [
                    `pl-tag-input-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                ]
            },
        },
        methods: {
            async pl_clear() {
                if (!!this.p_disabled || !!this.p_readonly) return
                if (!!this.$listeners.clear) this.$listeners.clear(e)
                else {
                    this.p_value = []
                    this.$emit('input', null)
                }
            },
            async pl_close(item, index) {
                if (!!this.onRemove) {
                    await this.onRemove(item, index)
                } else {
                    this.p_value.splice(index, 1)
                }
                this.$emit('input', this.p_value)
            },
            async pl_enter() {
                if (!!this.onCreate) {
                    await this.onCreate(this.p_text)
                } else {
                    this.p_value.push(this.p_text)
                }
                this.p_text = null
                this.$emit('input', this.p_value)
            },
            pl_mouseenter(e) {
                this.p_hover = true
                this.$emit('mouseenter', e)
            },
            pl_mouseleave(e) {
                this.p_hover = false
                this.$emit('mouseleave', e)
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-tag-input {
            background-color: white;
            box-sizing: border-box;
            outline: none;
            display: inline-flex;
            vertical-align: middle;
            align-items: center;
            justify-content: flex-start;
            min-height: 28px;
            font-size: 11.2px;
            position: relative;

            .pl-tag:not(:last-child) {
                margin-right: 3px;
            }

            .pl-tag-input-el {
                outline: none;
                border-radius: plVar(borderFillet);
                font-size: 12px;
                padding: 3px 12px;
                width: 100px;
            }

            .pl-tag-input-content {
                flex: 1;
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
            }

            .pl-tag-input-clear-icon {
                cursor: pointer;
            }

            @include plColors {
                &.pl-tag-input-color-#{$key} {
                    border: solid 1px $value;
                    color: $colorDeep;

                    .pl-tag-input-el {
                        color: inherit;
                        border: solid 1px rgba($value, 0.4);
                        flex: 1;
                    }
                }
            }

            &:focus {
                border-color: plVar(colorPrimary);
                color: plVar(colorPrimaryDeep);
            }
        }
    }
</style>