<template>
    <pl-button :label="label" :icon="icon" type="none" textAlign="left" noPadding/>
</template>

<script>
    import PlButton from "../pl-button";

    export default {
        name: "pl-dropdown-item",
        components: {PlButton},
        props: {
            label: {},
            icon: {},
        },
    }
</script>

<style lang="scss">

</style>