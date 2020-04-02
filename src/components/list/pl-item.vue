<template>
    <component :is="tag" class="pl-item" @click="e=>$emit('click',e)" :class="{'pl-item-block':block}">
        <slot></slot>
    </component>
</template>

<script>
    export default {
        name: "pl-item",
        props: {
            block: {type: Boolean},
            tag: {type: String, default: 'div'},
        },
    }
</script>