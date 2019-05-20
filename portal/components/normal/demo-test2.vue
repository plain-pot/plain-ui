<template>
    <div class="demo-test2">
        <im-button label="demo-test2" @click="test"/>
    </div>
</template>

<script>


    export default {
        name: "demo-test2",
        data() {
            return {
                a: 111,
                b: 222,
            }
        },
        computed: {
            ret() {
                console.log('calc ret')
                return this.a + '' + this.b
            },
        },
        mounted() {
        },
        methods: {
            test() {
                console.log(this.ret)
                console.log(this.ret)
                console.log(this.ret)
            },
        }
    }
</script>

<style lang="scss">

</style>