<template>
    <div class="pl-tag-input" :class="classes">
        <template v-for="(item,index) in p_value">
            <slot :item="item" :index="index">
                <pl-tag :key="index" :label="item" :close="isEditable && close" @close="onTagClose(item,index)"/>
            </slot>
        </template>

        <pl-input v-model="inputValue"
                  v-if="!noInput"
                  ref="input"
                  key="input"
                  @enter="onInputEnter">
            <div class="pl-tag-input-not-edit" v-if="!isEditing" @click="onClickEditButton">
                <pl-icon icon="el-icon-plus"/>
                <span>添加</span>
            </div>
        </pl-input>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, RefsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-tag-input",
        mixins: [
            StyleMixin,
            EmitMixin,
            EditMixin,
            RefsMixinFactory({
                input: Object,
            })
        ],
        props: {
            value: {type: Array},                                                           // 数组，双向绑定值
            close: {type: Boolean, default: true},                                          // 是否可删除
            beforeAdd: {type: Function},                                                    // 添加前校验
            beforeRemove: {type: Function},                                                 // 删除前校验
            formatValue: {type: Function},                                                  // 格式化输入值，返回一个值，或者对象
            noInput: {type: Function},                                                      // 是否显示输入框
        },
        emitters: {
            emitInput: Function,
        },
        provide() {
            return {
                plTagInput: this,
            }
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_value: this.value,
                isEditing: false,
                inputValue: null,

                onClickWindow: (e) => {
                    if (!this.input.$el.contains(e.target)) {
                        this.isEditing = false
                        window.removeEventListener('click', this.onClickWindow, true)
                    }
                }
            }
        },
        computed: {
            classes() {
                return [
                    `pl-tag-input-status-${this.p_status || 'primary'}`,
                    {
                        'pl-tag-input-disabled': this.isDisabled,
                    },
                ]
            },
        },
        beforeDestroy() {
            window.removeEventListener('click', this.onClickWindow, true)
        },
        methods: {
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 点击添加按钮动作
             * @author  韦胜健
             * @date    2020/3/26 10:56
             */
            async onClickEditButton() {
                if (!this.isEditable) {
                    return
                }

                this.isEditing = true
                await this.$plain.nextTick()
                this.input.focus()

                // 点击其他元素的时候关闭输入状态
                await this.$plain.utils.delay(0)

                window.addEventListener('click', this.onClickWindow, true)
            },
            /**
             * 输入框回车动作
             * @author  韦胜健
             * @date    2020/3/26 10:56
             */
            async onInputEnter() {
                if (!this.isEditable) {
                    return
                }

                let inputValue = this.inputValue

                if (inputValue !== 0 && !inputValue) {
                    return
                }

                if (!!this.beforeAdd) {
                    await this.beforeAdd(inputValue)
                }

                if (!!this.formatValue) {
                    inputValue = await this.formatValue(inputValue)
                }

                const value = this.p_value || []
                value.push(inputValue)
                this.p_value = value
                this.emitInput(value)
                this.inputValue = null
            },
            /**
             * 删除tag
             * @author  韦胜健
             * @date    2020/3/26 11:03
             */
            async onTagClose(item, index) {
                if (!this.isEditable) {
                    return
                }

                if (!!this.beforeRemove) {
                    await this.beforeRemove(item, index)
                }

                this.p_value.splice(index, 1)
                this.emitInput(this.p_value)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tag-input {
            .pl-tag {
                margin-bottom: 8px;

                &:not(:last-child) {
                    margin-right: 8px;
                }
            }

            .pl-input {
                margin-bottom: 8px;

                .pl-input-inner {
                    border-style: dashed;
                    width: 100% !important;
                }
            }

            .pl-tag-input-not-edit {
                text-align: center;
                cursor: pointer;
            }

            @include statusMixin(tag-input) {
                .pl-tag-input-not-edit {
                    color: $value;
                }
            }

            &.pl-tag-input-disabled {
                .pl-tag-input-not-edit {
                    cursor: not-allowed;
                    color: $disabledText;
                }
            }
        }
    }
</style>