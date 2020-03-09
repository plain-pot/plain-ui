<template>
    <div class="pl-checkbox-group">
        <pl-checkbox label="全选" ignore @click.native="onClickCheckBoxForAll" :value="checkStatus === 'check'">
            <template slot="checkbox-inner">
                <pl-checkbox-inner status="check" key="check" v-if="checkStatus === 'check'"/>
                <pl-checkbox-inner status="uncheck" key="uncheck" v-if="checkStatus === 'uncheck'"/>
                <pl-checkbox-inner status="minus" key="minus" v-if="checkStatus === 'minus'"/>
            </template>
        </pl-checkbox>
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixin} from "../../utils/mixins";

    export default {
        name: "pl-checkbox-group",
        mixins: [EditMixin, EmitMixin, PropsMixin({
            min: PropsMixin.Number,
            max: PropsMixin.Number,
        })],
        props: {
            value: {type: Array},
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
            size: {type: String, default: 'default'},                   // large,default,small

            min: {type: Number},                                        // 最大勾选个数
            max: {type: Number},                                        // 最小勾选个数
        },
        emitters: {
            emitInput: null,
        },
        provide() {
            return {
                plCheckboxGroup: this,
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
                items: [],
            }
        },
        computed: {
            checkStatus() {
                if (!this.p_value || this.p_value.length === 0) return 'uncheck'
                if (this.items.every(item => this.isChecked(item.val))) return 'check'
                return 'minus'
            },
        },
        mounted() {
            this.checkTypeOfValue()
        },
        methods: {

            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 处理选中 checkbox 的动作
             * @author  韦胜健
             * @date    2020/3/4 18:50
             */
            onClickCheckbox(checkbox) {
                if (!this.isEditable) return
                const val = checkbox.val
                let value = this.p_value || []
                if (this.isChecked(val)) {
                    // 删除
                    if (!!this.p_min && value.length <= this.p_min) {
                        return this.$plain.$message.warn(`最少选择 ${this.p_min} 个选项！`)
                    }
                    value = value.filter(item => item !== val)
                    this.emitInput([...value])
                } else {
                    // 添加
                    if (!!this.p_max && value.length >= this.p_max) {
                        return this.$plain.$message.warn(`最多选择 ${this.p_max} 个选项！`)
                    }
                    value.push(val)
                    this.emitInput([...value])
                }
            },
            /**
             * 点击全选按钮
             * @author  韦胜健
             * @date    2020/3/4 19:11
             */
            onClickCheckBoxForAll() {
                if (!this.isEditable) return
                switch (this.checkStatus) {
                    case "check":
                        this.p_value = []
                        break
                    case "uncheck":
                    case "minus":
                        this.p_value = Array.from(new Set((!!this.p_max ? this.items.slice(0, this.p_max) : this.items).map(item => item.val)))
                        break
                }
                this.emitInput(this.p_value)
            },
            /**
             * 收集子组件
             * @author  韦胜健
             * @date    2020/3/4 19:09
             */
            addItem(item) {
                this.items.push(item)
            },
            /**
             * 删除子组件
             * @author  韦胜健
             * @date    2020/3/4 19:09
             */
            removeItem(item) {
                const index = this.items.indexOf(item)
                index > -1 && this.items.splice(index, 1)
            },

            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 检查value的类型，必须是一个数组
             * @author  韦胜健
             * @date    2020/3/4 18:49
             */
            checkTypeOfValue() {
                if (!!this.value && !Array.isArray(this.value)) {
                    console.error('checkbox: typeof value must be array')
                }
            },
            /**
             * 判断 checkbox是否选中
             * @author  韦胜健
             * @date    2020/3/4 18:50
             */
            isChecked(val) {
                let value = this.p_value || []
                return value.indexOf(val) > -1
            },
        },
    }
</script>

<style lang="scss">
</style>