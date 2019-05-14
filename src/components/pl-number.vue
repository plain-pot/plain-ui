<template>
    <pl-input ref="input"
              class="pl-number"
              :value="p_value"
              v-bind="inputBinding"

              @up="p_add"
              @down="p_subtract"
              @input="p_input"
              @blur="pl_blur"
              @click="e=>$emit('click',e)"
              @clear="pl_clear"
    >
        <div slot="append" class="pl-number-controller" v-if="!noController">
            <div class="pl-number-up" @click.stop="e=>!disabled&&!readonly&&p_add(e)">
                <pl-icon class="pl-number-icon-up" icon="pl-up"/>
            </div>
            <div class="pl-number-down" @click.stop="e=>!disabled&&!readonly&&p_subtract(e)">
                <pl-icon class="pl-number-icon-down" icon="pl-down"/>
            </div>
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
            input: {},

            step: {type: Number, default: 1},
            min: {type: Number},
            max: {type: Number},
            noController: {type: Boolean,},
            fixed: {type: Number},
        },
        data() {
            return {
                p_timer: null,
            }
        },
        computed: {
            inputBinding() {
                return Object.assign({}, this.simpleBinding, this.input)
            },
        },
        methods: {
            p_add() {
                if (this.$refs.input.p_readonly || this.$refs.input.p_disabled) return

                let val = this.p_value == null ? 0 : this.p_value - 0
                val += this.step
                val = this.p_validate(val)
                this.p_value = val
                this.p_emitValue()
            },
            p_subtract() {
                if (this.$refs.input.p_readonly || this.$refs.input.p_disabled) return

                let val = this.p_value == null ? 0 : this.p_value - 0
                val -= this.step
                val = this.p_validate(val)
                this.p_value = val
                this.p_emitValue()
            },
            async p_input(val) {
                val = val.trim().replace(/[^\-0-9\.]/g, '')
                this.p_value = val
                this.$refs.input.p_value = val
            },
            p_validate(val) {
                if (val == null || val === '') return null
                val = val - 0
                if (this.max != null && val > this.max) return this.max
                if (this.min != null && val < this.min) return this.min
                return val
            },
            async pl_blur(e) {
                let val = this.p_value
                if (val == null || val === '') {
                    val = null
                } else {
                    val = Number(val)
                    if (isNaN(val)) {
                        val = this.value
                    } else {
                        if (!!this.fixed) {
                            val = val.toFixed(this.fixed)
                        }
                        val = this.p_validate(val)
                    }
                }
                await this.$plain.nextTick()
                this.p_value = this.$refs.input.p_value = val
                this.p_emitValue()
            },
            pl_clear() {
                this.p_value = null
                this.p_emitValue()
            },
        }
    }
</script>