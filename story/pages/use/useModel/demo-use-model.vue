<template>
    <div class="demo-use-model">
        <h4>单项绑定</h4>
        <demo-use-model-component v-model="val"/>
        <demo-use-model-component v-model="val"/>
        <h4>多值绑定</h4>
        <demo-use-model-component range v-model:start="start" v-model:end="end"/>
        <demo-use-model-component range v-model:start="start" v-model:end="end"/>
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