<template>
    <button class="pl-button plain-click-node"
            :class="classes"
            :style="styles"
            v-click-wave="'large'"
            :type="type"
            :disabled="isDisabled"
            :readonly="isReadonly"
            v-bind="nativeProps"
            @click="handleClick">
        <pl-loading type="gamma" v-if="isLoading"/>
        <slot>
            <pl-icon :icon="icon" v-if="!!icon && !isLoading"/>
            <span v-if="!!props.label">{{props.label}}</span>
        </slot>
    </button>
</template>

<script>
    import ClickWave from "../../directives/ClickWave";
    import {EditMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-button",
        directives: {ClickWave},
        mixins: [
            EditMixin,
            StyleMixin,
        ],
        inject: {
            plButtonGroup: {default: null},
        },
        emitters: {
            emitClick: Function,
        },
        props: {
            status: {type: String, default: 'primary'},                             // primary,success,warning,error,info
            mode: {type: String, default: 'fill'},                                  // fill,stroke,text
            label: {type: String, convert: PropsMixinFactory.Promise},              // 按钮文本
            width: {type: [String, Number], convert: PropsMixinFactory.Number},     // 按钮宽度
            icon: {type: String},                                                   // 按钮图标
            active: {type: Boolean},                                                // 按钮是否高亮
            noPadding: {type: Boolean},                                             // 按钮是否无边距
            block: {type: Boolean},                                                 // 块级元素
            throttleClick: {type: [Boolean, Number]},                               // click节流
            autoLoading: {type: Boolean},                                           // 在执行click处理函数时，是否自动变更为加载状态

            /*---------------------------------------native-------------------------------------------*/
            type: {type: String, default: 'button'},
            nativeProps: {},
        },
        watch: {
            throttleClick: {
                immediate: true,
                handler(val) {
                    if (!val) {
                        return this.handleClick = this.handleClickInner
                    }
                    if (val === true) {
                        val = 1000
                    }
                    this.handleClick = this.$plain.utils.throttle(this.handleClickInner, val, {trailing: false})
                },
            },
        },
        data() {
            return {
                wave: false,
                handleClick: null,
                handleClickInner: async (e) => {
                    if (this.isEditable) {
                        if (this.autoLoading) {
                            this.p_loading = true
                            try {
                                await this.$listeners.click(e)
                            } catch (e) {
                            } finally {
                                this.p_loading = false
                            }
                        } else {
                            this.emitClick(e)
                        }
                    }
                },
            }
        },
        computed: {
            targetMode() {
                return !!this.plButtonGroup ? this.plButtonGroup.mode : this.mode
            },
            classes() {
                return [
                    `pl-button-status-${this.status}`,
                    `pl-button-mode-${this.targetMode}`,
                    `pl-button-shape-${this.p_shape || 'fillet'}`,
                    `pl-button-size-${this.p_size || 'normal'}`,

                    {
                        'pl-button-icon': !!this.icon,
                        'pl-button-active': !!this.active,
                        'pl-button-loading': !!this.isLoading,
                        'pl-button-noPadding': !!this.noPadding,
                        'pl-button-wave': !!this.wave,
                        'pl-button-has-icon': !!this.icon,
                        'pl-button-block': !!this.block,
                        'pl-button-disabled': !!this.isDisabled,
                        'pl-button-icon-only': !!this.icon && !this.props.label,
                    },
                ]
            },
            styles() {
                return !!this.props.width ? {width: `${this.props.width}px`} : ''
            },
        },
    }
</script>

<style lang="scss">
</style>