<template>
    <div>
        我是页面二
        <div>
            <pl-input/>
        </div>
        <pl-button label="回退" @click="back"/>
    </div>
</template>

<script>
    import {defineComponent} from 'vue'
    import {useNav} from "../../../src/packages/nav/nav-stack";

    export default defineComponent({
        setup() {
            const $nav = useNav()
            return {
                back: () => {
                    $nav.back()
                },
            }
        },
    })
</script>

<style lang="scss">

</style>