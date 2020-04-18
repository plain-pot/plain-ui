<template>
    <div class="pl-date">
    </div>
</template>

<script>
    export default {
        name: "pl-date",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-date-service {
            .plain-popper-content {
                padding: 0 !important;

                & > .pl-date-base-panel {
                    border: none;
                }
            }
        }
    }
</style>