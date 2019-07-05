<template>
    <div class="pl-item" @click="e=>$emit('click',e)" :class="{'pl-item-block':block}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-item",
        props: {
            block: {type: Boolean},
        },
    }
</script>
