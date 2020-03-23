<template>
    <div class="pl-dropdown-group">
        <div v-if="!!p_label" class="pl-dropdown-group-label">
            {{p_label}}
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-dropdown-group",
        mixins: [
            PropsMixinFactory.create({
                label: PropsMixinFactory.Promise
            })
        ],
        props: {
            label: {type: [String, Object]},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>