<template>
    <div>
        我是页面一
        <div>
            <pl-input/>
        </div>
        <pl-button label="打开页面二" @click="nextPage"/>
    </div>
</template>

<script>
    import {defineComponent} from 'vue'
    import {useNav} from "../../../src/packages/nav/nav-stack";

    export default defineComponent({
        setup() {
            const $nav = useNav()
            return {
                nextPage: () => {
                    $nav.push({
                        title: '页面二',
                        path: 'nav/nav-second-page'
                    })
                },
            }
        },
    })
</script>

<style lang="scss">

</style>