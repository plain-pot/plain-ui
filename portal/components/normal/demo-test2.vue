<template>
    <div class="demo-test2">
        demo-test2
    </div>
</template>

<script>

    const NAVIGATOR_TAB = {
        id: null,
        title: null,
        path: null,
        param: null,
        security: null,
        data: null,
        iframe: false,
    }

    class NavigatorTab {

        constructor(option) {
            Object.keys(NAVIGATOR_TAB).forEach(key => {
                this[key] = option[key] === undefined ? NAVIGATOR_TAB[key] : option[key]
            })
        }
    }

    export default {
        name: "demo-test2",
        mounted() {
            // const tab = new NavigatorTab({id: this.$plain.$utils.uuid(), path: 'hello'})
            // console.log(tab)
            const list = []
            let i = 0
            while (i < 100) {
                list.push(i)
                i++
            }
            console.log(list)
            const chunks = this.$plain.$utils.chunk(list, 20)
            console.log(chunks
            )
        },
    }
</script>

<style lang="scss">

</style>