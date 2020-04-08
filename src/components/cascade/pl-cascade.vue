<template>
    <pl-input
            ref="input"
            class="pl-cascade"
            :class="classes"
            clearIcon
            suffixIcon="el-icon-d-arrow-right"
            :value="(isShow&&filterable)?p_inputValue:showValue"
            :placeholder="p_placeholder"
            :clearHandler="clearHandler"
            :inputReadonly="!filterable"
            :isFocus="isOpen"

            @change="onInputChange"
            @click-input="onClickInput"
            @keydown.esc="onEsc"
            @blur="onBlur"
            @focus="onFocus"
    />
</template>

<script lang="ts">
    import {Cascade} from "./service";
    import panel from './pl-cascade-panel'
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {CascadeData} from "./CascadeData";

    const props = {
        ...panel.props,
        showLast: {type: Boolean},                                          // 格式化显示值函数
        separator: {type: String, default: ' / '},                          // 显示值分隔符
        filterable: {type: Boolean},                                        // 是否可筛选
    }

    export default {
        name: "pl-cascade",
        props,
        mixins: [
            EmitMixin,
            EditMixin,
            RefsMixinFactory({
                input: Object
            }),
        ],
        emitters: {
            emitInput: Function,
            emitBlur: Function,
            emitFocus: Function,
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            const p_inputValue: string = null
            const p_placeholder: string = this.placeholder

            const service: Cascade = null
            const p_focusTimer: number = 0
            const p_blurTimer: number = 0
            const p_value = this.value

            const option = () => ({
                value: this.p_value,
                reference: this.$el,
                ...(Object.keys(props).reduce((ret, key) => {
                    ret[key] = this[key]
                    return ret
                }, {})),
                filterText: this.p_inputValue,
                on: {
                    change: (val) => {
                        this.p_value = val
                        this.emitValue(val)
                    },
                    mousedownPopper: async () => {
                        this.p_focusTimer++
                        this.p_blurTimer++
                    },
                    clickPopper: () => {
                        this.input.focus()
                    },
                },
            })

            return {
                p_inputValue,
                p_placeholder,
                service,
                p_focusTimer,
                p_blurTimer,
                p_value,
                option,

            }
        },
        created() {
        },
        beforeDestroy() {
            if (!!this.service) this.service.destroy()
        },
        computed: {
            isShow() {
                return !!this.service && this.service.isShow()
            },
            isOpen() {
                if (!this.service) return false
                return this.service.isOpen()
            },
            classes() {
                return {
                    'pl-cascade-open': this.isShow,
                }
            },
            showValue() {
                if (!this.p_value) return null

                let result = []
                let list = this.formatData as CascadeData[]
                for (let i = 0; i < this.p_value.length; i++) {
                    const sourceKey = this.p_value[i];
                    let flag: boolean = false
                    for (let j = 0; j < list.length; j++) {
                        const target = list[j];
                        if (sourceKey === target.key) {
                            if (this.showLast) {
                                return target.label
                            }
                            result.push(target.label)
                            list = target.children
                            flag = true
                            break
                        }
                    }
                    if (!flag) {
                        result = [...result, ...(this.p_value.slice(i))]
                        break
                    }
                }
                return result.join(' / ')
            },
            formatData() {
                if (!this.checkProps()) return []
                let data = this.data
                if (typeof data === "function") {
                    data = data()
                }
                return data.map(item => this.formatNodeData(item, this.rootData))
            },
        },
        methods: {
            clearHandler() {
                this.emitValue(null)
            },

            /*---------------------------------------methods-------------------------------------------*/
            async show() {
                if (!this.isEditable) {
                    return
                }

                if (!this.service) {
                    this.service = await this.$plain.$cascade(this.option)
                }
                this.service.show()
            },
            async hide() {
                if (!this.service) {
                    return
                }
                this.service.hide()
            },
            async toggle() {
                if (!this.service) {
                    this.show()
                } else {
                    this.service.toggle()
                }
            },
            /*---------------------------------------utils-------------------------------------------*/
            emitValue(val) {
                this.p_value = val
                this.emitInput(val)
            },
            /**
             * 检查props是否合法
             * @author  韦胜健
             * @date    2020/3/30 18:48
             */
            checkProps() {
                if (!this.data) return true
                if (!this.keyField) {
                    console.error('pl-cascade 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                    return false
                }
                if (!this.childrenField) {
                    console.error('pl-cascade 的 childrenKey不能为空')
                    return false
                }
                return true
            },
            formatNodeData(data, parent?: CascadeData, level: number = 1): CascadeData {
                const node = new CascadeData(data, this, level, parent)
                node.children = (node.childrenData || []).map(child => this.formatNodeData(child, node, level + 1))
                return node
            },
            /*---------------------------------------handler-------------------------------------------*/

            onClickInput() {
                this.toggle()
            },
            onInputChange(val) {
                this.p_inputValue = val
            },
            onEsc() {
                this.hide()
            },
            onBlur() {
                if (this.p_blurTimer === 0) {
                    this.hide()
                    this.emitBlur()
                } else {
                    this.p_blurTimer--
                }
            },
            onFocus() {
                if (this.p_focusTimer === 0) {
                    this.emitFocus()
                } else {
                    this.p_focusTimer--
                }
            },
        },
    }
</script>

<style lang="scss">


    @include themify {
        .pl-cascade-panel {
            display: inline-block;
            height: 200px;
            border: solid 1px $ibc;
            border-radius: 2px;

            & > .pl-list {
                height: 100%;
                overflow: hidden;
            }

            .pl-cascade-list {
                width: 180px;
                height: 100%;
                padding: 6px 0;
                font-size: 14px;
                display: inline-block;
                vertical-align: top;

                &:not(:last-child) {
                    border-right: solid 1px $ibc;
                }

                .pl-list {
                    overflow: hidden;
                }

                .pl-cascade-item {
                    padding: 4px 6px 4px 16px;
                    transition: all 300ms $transition;
                    cursor: pointer;

                    .pl-cascade-content {
                        padding-right: 30px;
                        position: relative;

                        .pl-cascade-arrow {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 0;
                            width: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: $icc;
                        }
                    }

                    &:hover {
                        background-color: rgba($colorInfo, 0.1);
                    }

                    &.pl-cascade-item-expand {
                        color: $ihc;
                        background-color: rgba($colorInfo, 0.1);
                    }

                    &.pl-cascade-item-active {
                        color: $colorPrimary;
                        background-color: rgba($colorPrimary, 0.1);
                    }

                    &.pl-cascade-empty {
                        padding-right: 0;
                        padding-left: 0;
                        text-align: center;
                        font-size: 12px;
                        color: $disabledText;
                        background-color: transparent;
                        cursor: auto;

                        .pl-icon {
                            margin-right: 3px;
                        }
                    }

                    &.pl-cascade-item-disabled {
                        background-color: transparent;
                        color: $disabledText;
                        cursor: not-allowed;
                    }
                }

                &.pl-cascade-filter-list {
                    width: 360px;
                }
            }
        }

        .pl-cascade {
            .pl-input-suffix-icon .pl-icon {
                transform: rotate(90deg);
                transition: transform 300ms $transition;
            }

            &.pl-cascade-open {
                .pl-input-suffix-icon .pl-icon {
                    transform: rotate(-90deg);
                }
            }
        }
    }

</style>