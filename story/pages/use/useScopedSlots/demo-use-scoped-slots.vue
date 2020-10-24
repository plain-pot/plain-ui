<template>
    <div class="demo-use-scoped-slots">

        <input type="checkbox" id="has-demo-use-scoped-slots" v-model="hasScopedSlots">
        <label for="has-demo-use-scoped-slots">hasScopedSlots</label>

        <demo-tree-for-scoped-slots :data="data">
            <template v-slot="{node:{data},index}" v-if="hasScopedSlots">
                <button>{{index}}</button>
                <button>{{data.name}}</button>
                <button>{{data.val}}</button>
            </template>
        </demo-tree-for-scoped-slots>
    </div>
</template>

<script>

    import {DemoTreeForScopedSlots} from "./demo-use-scoped-slots-components";
    import {delay} from "../../../../src/utils/delay";

    async function getData() {
        await delay(Math.random() * 500 + 500)
        return [
            {name: '蛋糕', val: 'dangao'},
            {name: '奶茶', val: 'naicha'},
            {name: '果冻', val: 'guodong'},
            {name: '西瓜', val: 'xigua'},
        ]
    }

    export default {
        name: "demo-use-scoped-slots",
        components: {
            DemoTreeForScopedSlots,
        },
        data() {
            return {
                data: [],
                hasScopedSlots: true,
            }
        },
        async created() {
            console.log('created')
            this.data = await getData()
        },
    }
</script>

<style lang="scss">
    .demo-use-scoped-slots-components {
        &:not(.demo-use-scoped-slots-components-has-default) {
            background-color: #f2f2f2;
        }
    }
</style>