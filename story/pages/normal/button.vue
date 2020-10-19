<template>
    <div class="demo-button">
        <div v-for="item in ['primary','success','warn','error','info']" :key="item" :class="`pl-button pl-button-status-${item}`">
            {{item}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-button",

    }
</script>

<style lang="scss">
    @include theme {
        .pl-button {
            @include statusMixin(button) {
                background-color: $value;
                color: white;
            }
        }
    }
</style>