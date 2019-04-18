<template>
    <div class="pl-button-group" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'pl-button-group',
        props: {
            shape: {
                type: String,
                default: 'fillet',
            },
            size: {
                type: String,
                default: 'default',
            },
            color: {
                type: String,
                default: 'primary',
            },
            vertical: {
                type: Boolean
            },
        },
        computed: {
            classes() {
                return [
                    {
                        [`pl-button-group-shape-${this.shape}`]: !!this.shape,
                        [`pl-button-group-color-${this.color}`]: !!this.color,
                        [`pl-button-group-size-${this.size}`]: !!this.size,
                    },
                    `pl-button-group-${!!this.vertical ? 'vertical' : 'horizontal'}`,
                ];
            },
        },
    };
</script>