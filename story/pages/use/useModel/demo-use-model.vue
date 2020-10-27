<template>
    <div class="demo-use-model">
        <demo-use-model-component
                v-model="val"
                v-model:start="start"
                v-model:end="end"/>
        <hr>
        <demo-use-model-component
                v-model="val"
                v-model:start="start"
                v-model:end="end"/>
    </div>
</template>

<script>

    import {DemoUseModelComponent} from "./demo-use-model-component";

    export default {
        name: "demo-use-model",
        components: {
            DemoUseModelComponent,
        },
        data() {
            return {
                val: 'val',
                start: 'start',
                end: 'end'
            }
        },
    }
</script>

<style lang="scss">

</style>