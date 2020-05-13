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
        beforeDestroy() {
            console.log(`demo child ${this.title} destroyed`)
        }
    }
</script>

<style lang="scss">

</style>