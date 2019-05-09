<template>
    <pl-input icon="pad-doubledown"
              :value="p_showLabel"
              @clear="p_clear"
              class="pl-cascade"
              :class="{'pl-cascade-show':isShow}"
              @click="pl_click">
        <pl-popper ref="popper"
                   slot="prepend"
                   :height="28*5"
                   :width="null"
                   :reference="p_reference"
                   disabled-equal
                   @show="isShow = true"
                   @hide="isShow = false"
        >
            <div class="pl-cascade-popper">
                <pl-cascade-option :cascade-width="cascadeWidth"
                                   :data="data"
                                   :label-key="labelKey"
                                   :children-key="childrenKey"
                                   :value-key="valueKey"
                                   :disabled-key="disabledKey"
                                   :current="p_tempValue[0]"
                                   :load-data-func="loadDataFunc"
                                   :scope-slot="$scopedSlots.default"
                                   @select="itemData => p_select(itemData,0)"
                                   @done="itemData => p_done(itemData)"/>
                <pl-cascade-option
                        v-for="(item,index) in p_tempValue"
                        :key="index"
                        :cascade-width="cascadeWidth"
                        :data="item[childrenKey]"
                        :label-key="labelKey"
                        :children-key="childrenKey"
                        :value-key="valueKey"
                        :disabled-key="disabledKey"
                        :current="p_tempValue[index+1]"
                        :load-data-func="loadDataFunc"
                        :scope-slot="$scopedSlots.default"
                        @select="itemData => p_select(itemData,index+1)"
                        @done="itemData => p_done(itemData)"/>
            </div>
        </pl-popper>
    </pl-input>
</template>

<script>
    import PlCascadeOption from "./pl-cascade-option";
    import {CascadeMixin} from "./index";
    import PlPopper from "../popper/pl-popper";
    import PlInput from "../pl-input";

    export default {
        name: "pl-cascade",
        components: {PlInput, PlPopper, PlCascadeOption},
        mixins: [CascadeMixin],
        props: {
            value: {type: Array, default: () => []},                                //双向绑定的数据
        },
        data() {
            return {
                isShow: false,
                p_value: this.$plain.$utils.deepCopy(this.value),
                p_tempValue: this.$plain.$utils.deepCopy(this.value),
                p_reference: null
            }
        },
        computed: {
            p_showLabel() {
                let array = this.p_value
                if (!array || array.length === 0) return
                if (this.showAllLevels) {
                    return array.map(item => item[this.labelKey]).join(',')
                } else {
                    return array[array.length - 1][this.labelKey]
                }
            },
        },
        mounted() {
            this.p_reference = this
        },
        methods: {
            p_select(itemData, optionPosition) {
                this.p_tempValue.splice(optionPosition, this.p_tempValue.length)
                this.p_tempValue.push(itemData)
                if (!!this.changeOnSelect) this.p_value = this.$plain.$utils.deepCopy(this.p_tempValue)
            },
            p_done() {
                this.$nextTick(() => {
                    this.p_value = this.$plain.$utils.deepCopy(this.p_tempValue)
                    this.p_show = false
                })
            },
            p_hide() {
                this.p_tempValue = this.$plain.$utils.deepCopy(this.p_value)
            },
            p_clear() {
                this.p_tempValue = []
                this.p_value = []
            },
            pl_click() {
                this.$emit('click')
                this.$refs.popper.show()
            },
        }
    }
</script>