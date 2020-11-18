<template>
    <div class="test-pass-attrs-hot-reload">
        <test-pass-attrs-dropdown
                :height="100"

                trigger="2222aaaass"
                :offset="1000"
        />
    </div>
</template>

<script>
    import {TestPassAttrsDropdown} from "./index";

    export default {
        name: "test-pass-attrs-hot-reload",
        components: {
            TestPassAttrsDropdown
        },
    }
</script>

<style lang="scss">

</style>