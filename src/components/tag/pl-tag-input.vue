<template>
    <button class="pl-tag-input" :class="classes">
        <pl-tag v-for="(item,index) in data" :key="index" :label="item" close/>
    </button>
</template>

<script>
    import PlTag from "./pl-tag";

    export default {
        name: "pl-tag-input",
        components: {PlTag},
        props: {
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
            data: {type: Array, default: () => []},
            close: {type: Boolean, default: true},
        },
        data() {
            return {}
        },
        computed: {
            classes() {
                return [
                    `pl-tag-input-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-tag-input {
            background-color: white;
            box-sizing: border-box;
            outline: none;

            .pl-tag:not(:last-child) {
                margin-right: 3px;
            }

            @include plColors {
                &.pl-tag-input-color-#{$key} {
                    border: solid 1px $value;
                    color: $colorDeep;

                    input {
                        color: inherit;
                    }
                }
            }
        }
    }
</style>