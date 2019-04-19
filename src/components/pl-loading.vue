<template>
    <div class="pl-loading" :class="[`pl-loading-color-${color}`]">
        <span class="pl-loading-default" v-if="type === 'default'"><span class="pl-loading-default-item" v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="i"></span></span>
        <pl-icon v-else :icon="`pl-loading-${type}`" loading/>
    </div>
</template>

<script>

    import PlIcon from "./pl-icon";

    export default {
        name: "pl-loading",
        components: {PlIcon},
        props: {
            type: {type: String, default: 'default'},
            color: {type: String, default: 'info'},
        },
    }
</script>