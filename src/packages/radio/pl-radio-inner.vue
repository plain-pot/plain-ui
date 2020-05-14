<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="pl-radio-inner" :class="`pl-radio-inner-${status}`">
        <circle cx="50" cy="50" r="30" v-if="status === 'check'"/>
    </svg>

</template>

<script>
    export default {
        name: "pl-radio-inner",
        props: {
            status: {},
        },
    }
</script>

<style lang="scss">
</style>