<template>
    <div class="contextmenu-service">
        <pl-button label="contextmenu" @contextmenu="useByContextmenu"/>
        <pl-button label="click" @click="useByClick"/>
        <pl-button label="reference" ref="btn" @click="useByReference"/>
    </div>
</template>

<script>
    import {$$contextmenu} from "../../../src/packages/contextmenu/contextmenu-service";

    export default {
        name: "contextmenu-service",
        methods: {
            useByContextmenu(e) {
                e.preventDefault()
                this.useByClick(e)
            },
            useByClick(e) {
                $$contextmenu(e, () => <div>
                    <div>第一个选项</div>
                    <div>第二个选项</div>
                    <div>第三个选项</div>
                </div>)
            },
            useByReference() {
                $$contextmenu(this.$refs.btn, () => <div>
                    <div>第一个选项</div>
                    <div>第二个选项</div>
                    <div>第三个选项</div>
                </div>)
            },
        },
    }
</script>

<style lang="scss">

</style>