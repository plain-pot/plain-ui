<template>
    <div class="pl-form" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-form",
        props: {
            textWidth: {type: String, default: 'auto'},
            textAlign: {type: String, default: 'left'},
        },
        data() {
            return {
                items: [],
            }
        },
        computed: {
            p_labelWidth() {
                if (!this.textWidth) return null
                if (this.textWidth !== 'auto') return this.textWidth
                return this.items.reduce((ret, item) => ret > item.labelWidth ? ret : item.labelWidth, 0)
            },
            classes() {
                return [
                    `pl-form-text-align-${this.textAlign}`
                ]
            },
        },
        methods: {
            valid() {
                return this.$plain.$valid.valid(this)
            },
            cancelValid() {
                return this.$plain.$valid.cancelValid(this)
            },
            setDisabled(flag = true) {
                return this.$plain.$valid.setDisabled(flag, this)
            },
            setReadonly(flag = true) {
                return this.$plain.$valid.setReadonly(flag, this)
            },


            pl_addItem(item) {
                this.items.push(item)
            },
            pl_removeItem(item) {
                this.$plain.$utils.removeFromArray(this.items, item)
            },
        }
    }
</script>

<style lang="scss">
    .pl-form {
        & > .pl-form-item {
            margin-right: 20px;
        }

        .pl-form-item {
            margin-bottom: 20px;
        }

        &.pl-form-text-align-left {
            .pl-form-item .pl-form-item-label {
                text-align: left;
            }
        }

        &.pl-form-text-align-center {
            .pl-form-item .pl-form-item-label {
                text-align: center;
            }
        }

        &.pl-form-text-align-right {
            .pl-form-item .pl-form-item-label {
                text-align: right;
            }
        }
    }
</style>