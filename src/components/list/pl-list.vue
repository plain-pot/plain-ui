<template>
    <transition-group :name="`pl-list-move-${direction}`" tag="div" class="pl-list">
        <slot></slot>
    </transition-group>
</template>

<script>
    export default {
        name: "pl-list",
        props: {
            direction: {                            //item入场出场动画 'left', 'right', 'top', 'bottom', 'left-top', 'top-left', 'right-top', 'top-right', 'left-bottom', 'bottom-left', 'right-bottom', 'bottom-right'
                type: String,
                default: 'bottom-right',
                
            },
        },
    }
</script>