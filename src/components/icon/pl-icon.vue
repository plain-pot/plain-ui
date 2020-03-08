<template>
    <i class="pl-icon" :class="[icon,{[`pl-icon-status-${status}`]:!!status}]" @click="e=>$emit('click',e)"/>
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