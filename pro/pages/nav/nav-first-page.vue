<template>
    <div>
        我是页面一,{{$nav}}
    </div>
</template>

<script>
    export default {
        name: "nav-first-page",
        data() {
            return {
                a: 1,
                b: 2,
            }
        },
        computed: {
            $nav() {
                return this.a + this.b
            },
        },
    }
</script>

<style lang="scss">

</style>