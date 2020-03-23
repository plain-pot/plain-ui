<template>
    <div class="pl-dropdown-wrapper">
        <slot></slot>
    </div>
</template>

<script>
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-dropdown-wrapper",
        mixins: [
            EmitMixin
        ],
        emitters: {
            emitClickItem: Function,
        },
        props: {},
        provide() {
            return {
                plDropdownWrapper: this,
            }
        },
        data() {
            return {}
        },
        methods: {
            onClickItem(dropdownItem) {
                const {p_label: label, icon, disabled} = dropdownItem
                this.emitClickItem({label, icon, disabled})
            },
        },
    }
</script>

<style lang="scss">
</style>