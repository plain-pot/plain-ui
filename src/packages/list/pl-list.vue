<template>
    <component :is="disabled?tag:'transition-group'" :name="`pl-list-move-${direction}`" :tag="tag" class="pl-list">
        <slot></slot>
    </component>
</template>

<script>
    export default {
        name: "pl-list",
        props: {
            direction: {                            //item入场出场动画 'left', 'right', 'top', 'bottom', 'left-top', 'top-left', 'right-top', 'top-right', 'left-bottom', 'bottom-left', 'right-bottom', 'bottom-right'
                type: String,
                default: 'bottom-right',

            },
            tag: {type: String, default: 'div'},
            disabled: {type: Boolean},
        },
    }
</script>

<style lang="scss">
    @include theme {
        .pl-item {
            transition: all 300ms $transition;
            @include public-style;
        }

        .pl-list {
            display: block;
            width: 100%;
            position: relative;
            @include public-style;

            .pl-item-block {
                display: block;
                width: 100% !important;
            }
        }

        $directions: (
                top:(x:0, y:-30%),
                left:(x:-80%, y:0),
                right:(x:80%, y:0),
                bottom:(x:0, y:30%),
                left-top:(x:-80%, y:-30%),
                top-left:(x:-80%, y:-30%),
                right-top:(x:80%, y:-30%),
                top-right:(x:80%, y:-30%),
                left-bottom:(x:-80%, y:30%),
                bottom-left:(x:-80%, y:30%),
                right-bottom:(x:80%, y:30%),
                bottom-right:(x:80%, y:30%),
        );

        @each $key, $value in $directions {
            .pl-list-move-#{$key}-enter {
                opacity: 0;
                transform: translateX(map_get($value, x)) translateY(map_get($value, y));
            }

            .pl-list-move-#{$key}-leave-to {
                opacity: 0;
            }

            .pl-list-move-#{$key}-leave-active {
                position: absolute;
            }
        }
    }
</style>