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
        provide() {
            return {
                plCollapseGroup: this,
            }
        },
        data() {
            return {
                items: [],
                stack: [],
            };
        },
        methods: {
            addItem(collapse) {
                this.items.push(collapse);
                if (!!collapse.p_value) {
                    this.stack.push(collapse);
                }
            },
            removeItem(collapse) {
                this.items.splice(this.items.indexOf(collapse), 1);
            },
            onClickItem(collapse) {
                if (!collapse.p_value) {
                    // 即将展开
                    collapse.open()
                    this.stack.push(collapse);

                    if (!!this.limit && this.limit > 0 && this.stack.length > this.limit) {
                        let collapse = this.stack.shift()
                        collapse.close()
                    }
                } else {
                    // 即将关闭
                    this.stack.splice(this.stack.indexOf(collapse), 1);
                    collapse.close()
                }
            },
        },
    };
</script>