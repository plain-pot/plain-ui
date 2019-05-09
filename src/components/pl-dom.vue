<template>
    <div class="pl-dom">
        <div class="pl-dom-content" ref="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>

    export default {
        name: "pl-dom",
        props: {
            value: {default: true},
        },
        data() {
            return {
                container: null,
            }
        },
        watch: {
            value(val) {
                this.update(val)
            },
        },
        mounted() {
            this.update(this.value)
        },
        methods: {
            update(value) {
                if (!value) {
                    this.$el.appendChild(this.$refs.content)
                } else {
                    this.container = this.pl_getContainer(value)
                    this.container.appendChild(this.$refs.content)
                }
            },
            pl_getContainer(value) {
                if (value === false) return this.$el
                if (value === true) return document.body
                return value instanceof window.Node ? value : document.querySelector(value)
            }
        },
        beforeDestroy() {
            this.update(false)
        },
    }
</script>

<style lang="scss">
    .pl-dom {
        display: inline-block;
        width: 0;
        height: 0;
        float: left;
    }
</style>