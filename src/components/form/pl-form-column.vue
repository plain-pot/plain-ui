<template>
    <div class="pl-form-column">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-form-column"
    }
</script>

<style lang="scss">
    .pl-form-column {
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
        .pl-form-item {
            display: block;
        }
    }
</style>