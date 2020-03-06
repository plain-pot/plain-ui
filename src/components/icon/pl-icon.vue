<template>
    <i class="pl-icon" :class="[icon,{[`pl-icon-status-${status}`]:!!status}]"/>
</template>

<script>

    export default {
        name: "pl-icon",
        props: {
            icon: {},
            status: {},
        },
    }
</script>

<style lang="scss">
</style>