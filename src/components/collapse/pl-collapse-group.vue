<template>
    <div class="pl-collapse-group" :class="[`pl-collapse-group-shape-${shape}`]">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'pl-collapse-group',
        props: {
            limit: {type: Number},
            shape: {type: String, default: 'none'},
        },
        data() {
            return {
                items: [],
                stack: [],
            };
        },
        methods: {
            p_add(collapse) {
                this.items.push(collapse);
                if (!!collapse.currentValue) {
                    this.stack.push(collapse);
                }
            },
            p_remove(collapse) {
                this.items.splice(this.items.indexOf(collapse), 1);
            },
            p_click(val, collapse) {
                if (!val) {
                    this.stack.push(collapse);
                    if (!!this.limit && this.limit > 0 && this.stack.length > this.limit) {
                        this.stack.shift().currentValue = false;
                    }
                } else {
                    this.stack.splice(this.stack.indexOf(collapse), 1);
                }
            },
        },
    };
</script>