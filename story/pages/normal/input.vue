<template>
    <div class="demo-input">
        <h4>demo-input</h4>
        <pl-input v-model="val[0]"/>
        <pl-input v-model="val[0]"/>
        val[0]：{{val[0]}}
    </div>
</template>

<script>
    export default {
        name: "demo-input",
        data() {
            return {
                val: {},
            }
        },
    }
</script>

<style lang="scss">

</style>