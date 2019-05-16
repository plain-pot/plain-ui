<template>
    <div class="pl-step-container" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-step-container",
        props: {
            direction: {type: String, default: 'horizontal'},
        },
        computed: {
            classes() {
                return [
                    `pl-step-container-${this.direction}`
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-step-container {
            &.pl-step-container-horizontal {
                width: 100%;
                display: flex;
                align-items: flex-start;

                .pl-step {
                    flex: 1;
                }
            }
        }
    }
</style>