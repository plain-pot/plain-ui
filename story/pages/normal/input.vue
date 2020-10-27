<template>
    <div class="demo-input">
        <pl-input v-model="text"/>
        <pl-input v-model="text"/>
        <hr>
        <pl-input v-for="item in ['primary','success','warn','error','info']" :key="item" :status="item" style="margin-right: 8px" v-model="text"/>
    </div>
</template>

<script>
    export default {
        name: "demo-input",
        data() {
            return {
                text: 'hello world',
                showPrepend: true,
            }
        },
    }
</script>

<style lang="scss">

</style>