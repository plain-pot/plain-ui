<template>
    <div class="demo-use-refs">
        <input type="text" ref="input">
        <pl-input ref="plInput"/>
        <hr>
        <button @click="clearInput">clear input</button>
        <button @click="clearPlInput">clear pl-input</button>
    </div>
</template>

<script lang="ts">
    import {Input} from '../../../../src'
    import {useRefs} from "../../../../src/use/useRefs";

    export default {
        name: "demo-use-refs",
        setup() {

            const {refs} = useRefs({
                input: HTMLInputElement,
                plInput: Input,
            })

            return {
                clearInput() {
                    console.log(refs.input)
                    refs.input.value = ''
                },
                clearPlInput() {
                    console.log(refs.plInput)
                    refs.plInput!.methods.clearValue()
                },
            }
        },
    }
</script>

<style lang="scss">

</style>