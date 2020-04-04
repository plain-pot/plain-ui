<template>
    <div class="color-picker">
        <demo-row title="基本用法">
            <pl-color-panel v-model="color"/>
            color:{{color}}
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color-picker",
        props: {},
        data() {
            return {
                color: '#dddddd',
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>