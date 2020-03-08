<template>
    <div class="test">
        <child-component v-model="val[0]"/>
        <input type="text" v-model="val[0]">
    </div>
</template>

<script>

    /* 组件里面的watch与 mixin里面的watch会同时生效 */
    const ChildComponent = {
        mixins: [{
            watch: {
                value(val) {
                    console.log('mixin change', val)
                },
            },
        }],
        props: {
            value: {},
        },
        watch: {
            value(val) {
                console.log('self change', val)
            },
        },
        render() {
            return (
                <input value="value" onInput={e => this.$emit('input', e.target.value)}/>
            )
        },
    };

    export default {
        name: "test",
        components: {ChildComponent},
        props: {},
        data() {
            return {
                val: {},
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>