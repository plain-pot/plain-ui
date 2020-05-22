<template>
    <div v-if="!!agent">
    </div>
</template>

<script>

    import {usePopperAgent} from "../../../src/packages/popper/service/PopperAgent";

    export default {
        name: "test",
        data() {
            return {
                agent: null,
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
</style>