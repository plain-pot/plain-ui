<template>
    <pl-input ref="input"
              class="pl-number"
              :value="p_value"
              v-bind="simpleBinding"

              @up="p_add"
              @down="p_subtract"
              @input="p_input"
              @clear="e=>$emit('clear',e)"
              @click="e=>$emit('click',e)"
    >
        <div slot="append" class="pl-number-controller" v-if="!noController">
            <pl-icon class="pl-number-icon-up" icon="pl-triangle-up-fill"
                     @click.stop="e=>!disabled&&!readonly&&p_add(e)"/>
            <pl-icon class="pl-number-icon-down" icon="pl-triangle-down-fill"
                     @click.stop="e=>!disabled&&!readonly&&p_subtract(e)"/>
        </div>
    </pl-input>
</template>

<script>
    import PlInput from "./pl-input";
    import {SimpleEditMixin, ValueMixin} from "../mixin/component-mixin";
    import PlIcon from "./pl-icon";

    export default {
        name: "pl-number",
        mixins: [SimpleEditMixin, ValueMixin],
        components: {PlIcon, PlInput},
        props: {

            step: {type: Number, default: 1},
            min: {type: Number},
            max: {type: Number},
            noController: {type: Boolean,},
        },
        data() {
            return {
                p_timer: null,
            }
        },
        methods: {
            p_add() {
                let val = this.p_value == null ? 0 : this.p_value - 0
                val += this.step
                val = this.p_validate(val)
                this.p_value = val
            },
            p_subtract() {
                let val = this.p_value == null ? 0 : this.p_value - 0
                val -= this.step
                val = this.p_validate(val)
                this.p_value = val
            },
            p_input(val) {
                if (!!this.p_timer) {
                    clearTimeout(this.p_timer)
                    this.p_timer = null
                }
                this.p_timer = setTimeout(() => {
                    this.p_value = this.p_validate(val)
                    // this.$refs.input.resetValue(this.p_value)
                }, 200)
            },
            p_validate(val) {
                if (val == null || val === '') return null
                if (this.max != null && val - 0 > this.max) return this.max
                if (this.min != null && val - 0 < this.min) return this.min
                return val
            },
        }
    }
</script>