<template>
    <div class="pl-icon" :class="{'pl-icon-enable-hover':hover}">
        <svg class="pl-icon-svg" aria-hidden="true" @click="e=>$emit('click',e)" :class="{'pl-icon-loading':loading}">
            <use :xlink:href="`#${icon}`"></use>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "pl-icon",
        props: {
            icon: {require: true},                              //图标名称
            loading: {type: Boolean, default: false},           //是否带loading动画
            hover: {type: Boolean,},
        },
    }
</script>