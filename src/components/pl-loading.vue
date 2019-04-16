<template>
    <pl-icon class="pl-loading" loading :icon="`pl-loading-${type}`" :class="[`pl-loading-color-${color}`]"/>
</template>

<script>

    import PlIcon from "./pl-icon";

    export default {
        name: "pl-loading",
        components: {PlIcon},
        props: {
            type: {type: String, default: 'section-one'},
            color: {type: String, default: 'black'},
        },
    }
</script>