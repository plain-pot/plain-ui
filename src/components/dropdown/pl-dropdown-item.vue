<template>
    <div class="pl-dropdown-item">
        <slot>{{p_label}}</slot>
    </div>
</template>

<script>
    import {EmitMixin, PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-dropdown-item",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                label: PropsMixinFactory.Promise,
            }),
        ],
        emitters: {
            emitClick: Function,
        },
        props: {
            label: {type: [String, Object]},
            icon: {type: String},
            disabled: {type: Boolean}
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>