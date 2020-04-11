<template>
    <pl-input
            ref="input"
            class="pl-cascade"
            :class="classes"
            clearIcon
            suffixIcon="el-icon-d-arrow-right"
            :value="(isShow&&filterable)?p_inputValue:showValue"
            :placeholder="((isShow&&filterable)?showValue:(!!inputProps?inputProps.placeholder:null)) || ''"
            :clearHandler="clearHandler"
            :inputReadonly="!filterable"
            :isFocus="isOpen"

            @change="onInputChange"
            @click-input="onClickInput"
            @keydown.esc="onEsc"
            @keydown.enter="onEnter"
            @blur="onBlur"
            @focus="onFocus"
    />
</template>

<script lang="ts">
    import panel from './pl-cascade-panel'
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {CascadeData} from "./CascadeData";
    import {AgentMixin} from "../service/service";

    const props = {
        ...panel.props,
        showLast: {type: Boolean},                                          // 格式化显示值函数
        separator: {type: String, default: ' / '},                          // 显示值分隔符
        filterable: {type: Boolean, default: true},                         // 是否可筛选
        showFormat: {type: Function},                                       // 显示值格式化函数

        inputProps: {type: Boolean},                                        // 输入框属性值
    }

    export default {
        name: "pl-cascade",
        props,
        mixins: [
            AgentMixin,
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
            emitClickItem: Function,
            emitGetChildren: Function,
        },
        watch: {
            value(val) {
                this.p_value = val
                this.p_inputValue = null
            },
        },
        data() {
            const p_inputValue: string = null
            const p_value = this.value
            const cacheData: { [key: string]: object[] } = {}

            const serviceOption = () => ({
                props: {
                    ...(Object.keys(props).reduce((ret, key) => {
                        ret[key] = this[key]
                        return ret
                    }, {})),
                    value: this.p_value,

                    filterText: this.p_inputValue,
                    getChildren: (...args) => this.p_getChildren(...args),
                    renderContent: (!!this.$scopedSlots.default || !!this.renderContent) ? (h, {node, index}) => {
                        if (!!this.$scopedSlots.default) return this.$scopedSlots.default({node, index})
                        if (!!this.renderContent) return this.renderContent(h, {node, index})
                    } : null,
                },
                popperProps: {
                    reference: this.$el,
                },

                listener: {
                    change: (...args) => {
                        this.emitValue(...args)
                    },
                    'click-item': (node) => {
                        this.emitClickItem(node)
                    },
                    'get-children': (data) => {
                        this.emitGetChildren(data)
                    },
                },
                popperListener: {
                    'mousedown-popper': () => {
                        this.p_focusTimer++
                        this.p_blurTimer++
                    },
                    'click-popper': () => {
                        this.input.focus()
                    },
                    'hide': () => {
                        this.p_inputValue = null
                    },
                }
            })

            return {
                p_inputValue,
                serviceOption,
                p_value,
                cacheData,
            }
        },
        computed: {
            classes() {
                return {
                    'pl-cascade-open': this.isShow,
                }
            },
            showValue() {
                if (!this.p_value) return null
                if (!!this.showFormat) return this.showFormat(this.p_value)

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
                if (!data) return []
                return data.map(item => this.formatNodeData(item, this.rootData))
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*---------------------------------------utils-------------------------------------------*/
            CreateService(option) {
                return this.$plain.$cascade(option)
            },
            emitValue(...args) {
                this.p_value = args[0]
                this.emitInput(...args)
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
            p_getChildren(node, resolve) {
                if (this.cacheData[node.key]) {
                    resolve(this.cacheData[node.key])
                } else {
                    this.getChildren(node, (data) => {
                        this.cacheData[node.key] = data
                        resolve(data)
                    })
                }
            },
            /*---------------------------------------handler-------------------------------------------*/
            clearHandler() {
                this.emitValue(null)
                this.p_inputValue = null
                this.input.focus()
            },
            onInputChange(val) {
                this.p_inputValue = val

                if (!this.isShow && !this.$plain.utils.ie) {
                    this.show()
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
            border-radius: 4px;

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

                    &.pl-cascade-item-expand, &:hover {
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

        .pl-cascade-service-popper {
            .plain-popper-content {
                padding: 0 !important;
                box-shadow: none !important;
            }

            .pl-cascade-panel {
                height: 100%;
                border: none !important;
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

        .pl-loading-mask {
            top: 1px;
            bottom: 1px;
            left: 1px;
            right: 1px;
        }
    }

</style>