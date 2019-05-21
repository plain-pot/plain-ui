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
                c: 333,
                d: 444,
            }
        },
        computed: {
            ab() {
                console.log('----------------reset ab-----------------')
                return this.a + '' + this.b
            },
            cd() {
                console.log('----------------reset cd-----------------')
                return this.c + '' + this.d
            },
        },
        mounted() {
        },
        methods: {
            test() {
                console.log(this.ab)
                console.log(this.ab)
                console.log(this.ab)
                console.log(this.ab)

                console.log('set a=aaa')
                this.a = 'aaa'
                console.log(this.ab)

                console.log('set b=bbb')
                this.b = 'bbb'
                console.log(this.ab)

                console.log('set a=111,b=222')
                this.a = '111'
                this.b = '222'
                console.log(this.ab)
                console.log(this.ab)
                console.log(this.ab)
            },
        }
    }
</script>

<style lang="scss">

</style>