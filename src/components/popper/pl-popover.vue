<template>
    <pl-popper v-bind="popperBinding"
               ref="popper"
               @mounted="e=>p_popper=e"
               @open="e=>$emit('open', e)"
               @close="e=>{$emit('close',e);p_show = false}"

               @show="pl_show"
               @hide="e=>$emit('hide',e)"

    >
        <pl-scroll :scrollbar-size="6" ref="scroll" v-bind="scrollBinding">
            <slot></slot>
        </pl-scroll>
    </pl-popper>
</template>

<script>
    import PlDom from "../pl-dom";
    import PlPopper from "./pl-popper";
    import PlScroll from "../pl-scroll";

    export default {
        name: "pl-popover",
        components: {PlScroll, PlPopper, PlDom},
        props: {
            reference: {},
            popper: {},
            scroll: {},

            defaultPopper: {
                default: () => ({})
            },
        },
        data() {
            return {
                p_popper: null,
                p_show: false,
            }
        },
        computed: {
            popperBinding() {
                return Object.assign({
                    reference: this.reference,
                }, this.defaultPopper, this.popper)
            },
            scrollBinding() {
                return Object.assign({
                    scrollX: false,
                    fitHostWidth: true,
                    ...(this.scroll || {})
                })
            },
        },
        methods: {
            show() {
                this.p_popper.show()
            },
            hide() {
                this.p_popper.hide()
            },
            toggle() {
                this.p_popper.toggle()
            },
            pl_show(e) {
                this.$refs.scroll.refreshSize()
                this.$emit('show', e)
                this.p_show = true
            },
        },
    }
</script>

<style lang="scss">

</style>