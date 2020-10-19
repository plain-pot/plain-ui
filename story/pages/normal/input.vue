<template>
    <div class="demo-input">
        <!--<h4>demo-input</h4>
        <pl-input v-model="val[0]"/>
        <pl-input v-model="val[0]"/>
        val[0]：{{val[0]}}-->

        <input type="checkbox" id="checkbox" v-model="showPrepend">
        <label for="checkbox">showPrepend:{{JSON.stringify(showPrepend)}}</label>

        <pl-input>
            <template #prepend v-if="showPrepend">
                <button>Prepend Button</button>
            </template>
            <template #append>
                <button>Append Button</button>
            </template>
        </pl-input>
    </div>
</template>

<script>
    export default {
        name: "demo-input",
        data() {
            return {
                val: {},
                showPrepend: true,
            }
        },
    }
</script>

<style lang="scss">

</style>