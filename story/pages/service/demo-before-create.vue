<template>
    <div class="demo-before-create">
        this is count:{{count}}
    </div>
</template>

<script>

    let count = 0

    export default {
        name: "demo-before-create",
        data() {
            return {
                count: count++,
            }
        },
    }
</script>

<style lang="scss">

</style>