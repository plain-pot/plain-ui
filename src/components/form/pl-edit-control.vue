<template>
    <div class="pl-edit-control"></div>
</template>

<script>
    import {EditMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-edit-control",
        mixins: [EditMixin],
        props: {
            value: {},
        },
        watch: {
            value() {
                this.valid()
            },
        },
        data() {
            return {
                isValid: null,
                validMsg: null,
            }
        },
        computed: {
            p_rules() {

            },
        },
        methods: {
            valid() {

            },
        },
        mounted() {
            !!this.validOnInit && this.valid()
        },
    }
</script>

<style lang="scss">

</style>