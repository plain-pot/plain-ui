<template>
    <div class="pl-form-item" :class="{'pl-form-item-block':block}">
        <div :style="labelWrapperStyles" class="pl-form-item-label">
            <span ref="label">{{label}}</span>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-form-item",
        props: {
            label: {},
            block: {type: Boolean},
        },
        data() {
            return {
                p_form: null,
                labelWidth: null,
            }
        },
        watch: {
            label: {
                immediate: true,
                async handler(val) {
                    await this.$plain.nextTick()
                    this.labelWidth = !!val ? this.$refs.label.offsetWidth : null
                },
            },
        },
        computed: {
            labelWrapperStyles() {
                if (!this.p_form) return null
                const styles = {}
                styles.width = this.$plain.$utils.unit(this.p_form.p_labelWidth)
                return styles
            },
        },
        created() {
            this.p_form = this.$plain.$dom.findComponentUpward(this, 'pl-form')
            if (!this.p_form) throw 'form-item must be wrapped in form component'
            this.p_form.pl_addItem(this)
        },
        beforeDestroy() {
            this.p_form.pl_removeItem(this)
        },
    }
</script>