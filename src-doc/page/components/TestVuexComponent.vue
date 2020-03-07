<template>
    <div class="TestVuexComponent">
        {{label}}-<span>{{$store.state.count}}</span>
    </div>
</template>

<script>
    export default {
        name: "TestVuexComponent",
        props: {
            label: {},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>