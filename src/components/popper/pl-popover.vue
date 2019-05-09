<template>
    <pl-popper v-bind="popperBinding" ref="popper">
        <pl-scroll>
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
            defaultPopper: {
                default: () => ({})
            },
        },
        computed: {
            popperBinding() {
                return Object.assign({
                    reference: this.reference,
                }, this.defaultPopper, this.popper)
            },
        },
    }
</script>

<style lang="scss">

</style>