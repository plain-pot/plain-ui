<template>
    <span>
        {{title}}
    </span>
</template>

<script>
    export default {
        name: "demo-child",
        props: {
            title: {type: String},
        },
        mounted() {
            console.log(`demo child ${this.title} mounted`)
        },
        beforeUnmount() {
            console.log(`demo child ${this.title} beforeUnmount`)
        }
    }
</script>

<style lang="scss">

</style>