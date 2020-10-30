<template>
    <div class="demo-use-props">
        <demo-use-props-component
                :name="name"
                :age="age"
                :flag="flag"
        />
    </div>
</template>

<script>

    import {DemoUsePropsComponent} from "./DemoUsePropsCompoment";

    export default {
        name: "demo-use-props",
        components: {
            DemoUsePropsComponent,
        },
        data() {
            return {
                name: new Promise((resolve) => {
                    setTimeout(() => resolve('hello world'), 2000)
                }),
                age: '200px',
                flag: () => true,
            }
        },
    }
</script>

<style lang="scss">

</style>