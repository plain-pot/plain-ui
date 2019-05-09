<template>
    <pl-dom>
        <transition>
            <div class="pl-popover">
                <slot></slot>
            </div>
        </transition>
    </pl-dom>
</template>

<script>
    import PlDom from "./pl-dom";

    export default {
        name: "pl-popover",
        components: {PlDom}
    }
</script>

<style lang="scss">

</style>