<template>
    <div>
<!--        <link-input :value="val" @input="saveChange"/>-->
<!--        <link-button @click="log" label="log"/>-->
    </div>
</template>

<script>
    export default {
        name: "test-vuex",
        methods: {
            log() {
                this.$dialog.show(this.val)
            },
            saveChange(val) {
                this.$store.commit('saveChange', val)
            },
        },
        computed: {
            val() {
                // if (!!this.$store) return this.$store.state.testData
            },
        },
    }
</script>

<style lang="scss">

</style>