<template>
    <div v-if="!!agent">
        <h1>Agent</h1>
        <div>
            {{agent.state.flag}}
        </div>
        <button @click="agent.methods.show">show</button>
        <button @click="agent.methods.hide">hide</button>
    </div>
</template>

<script>

    import {usePopperAgent} from "../../../src/packages/popper/service/PopperAgent";

    export default {
        name: "test",
        data() {
            return {
                agent: null,
            }
        },
        mounted() {
            setTimeout(() => {
                const agent = usePopperAgent()

                this.agent = agent
            }, 1000)
        }
    }
</script>

<style lang="scss">
</style>