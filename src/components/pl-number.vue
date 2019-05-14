<template>
    <pl-input ref="input"
              class="pl-number"
              :value="p_value"
              icon
              v-bind="inputBinding"

              @up="p_add"
              @down="p_subtract"
              @input="p_input"
              @click="e=>$emit('click',e)"
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

                if (val == null || val === '') {
                    this.p_value = null
                    this.p_emitValue()
                    return
                }
                if (!!this.p_timer) {
                    clearTimeout(this.p_timer)
                    this.p_timer = null
                }
                val = val.replace(/[^\-0-9\.]/g, '')
                await this.$plain.nextTick()
                this.p_value = this.p_validate(val)
                this.$refs.input.p_value = this.p_value
                this.p_emitValue()
            },
            p_validate(val) {
                if (val == null || val === '') return null
                val = val - 0
                if (this.max != null && val > this.max) return this.max
                if (this.min != null && val < this.min) return this.min
                return val
            },
        }
    }
</script>