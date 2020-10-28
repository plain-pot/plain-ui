<template>
    <div class="demo-input">
        <pl-input v-model="text"/>
        <pl-input v-model="text"/>
        <hr>
        <pl-input v-for="item in ['primary','success','warn','error','info']" :key="item" :status="item" style="margin-right: 8px" v-model="text"/>
        <h2>ref</h2>
        <pl-input ref="myInput"/>
        <button @click="outerClear"> outer clear</button>
    </div>
</template>

<script lang="ts">

    import {Input} from '../../../src'
    import {ref} from 'vue'

    export default {
        name: "demo-input",
        setup() {
            const text = ref('hello world')
            const showPrepend = ref(true)

            const input = Input.use.ref('myInput')

            return {
                text,
                showPrepend,
                outerClear: () => {
                    input.value!.methods.clear()
                }
            }
        },
    }
</script>

<style lang="scss">

</style>