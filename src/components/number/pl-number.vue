<template>
    <pl-input class="pl-number" :isFocus="isFocus">
        <div class="pl-number-prepend-button" tabindex="0">
            <pl-icon icon="el-icon-minus"/>
        </div>
        <input type="text" @focus="onFocus" @blur="onBlur">
        <div class="pl-number-append-button" tabindex="0">
            <pl-icon icon="el-icon-plus"/>
        </div>
    </pl-input>
</template>

<script>
    export default {
        name: "pl-number",
        props: {},
        data() {
            return {
                isFocus: false,
            }
        },
        methods: {
            onFocus() {
                this.isFocus = true
            },
            onBlur() {
                this.isFocus = false
            },
        },
    }
</script>

<style lang="scss">

</style>