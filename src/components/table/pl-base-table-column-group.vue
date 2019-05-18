<template>
    <div class="pl-base-table-column-group">
        <slot></slot>
    </div>
</template>

<script>
    import {ColumnGroupMixin, TableColumnGroup} from "./index";
    import {MountedMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-base-table-column-group",
        mixins: [ColumnGroupMixin, MountedMixin],
        data() {
            return {
                group:true,
            }
        },
        methods:{
            col() {
                const col = new TableColumnGroup(this)
                const children = this.$children.reduce((ret, item) => {
                    if (item.$options._componentTag === 'pl-render-func') {
                        item.$children.forEach(c => ret.push(c.col()))
                    } else {
                        const c = item.col()
                        ret.push(c)
                    }
                    return ret
                }, [])
                this.$set(col, 'children', children)
                return col
            },
        }
    }
</script>