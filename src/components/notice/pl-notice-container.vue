<template>
    <div class="pl-notice-container"
         :class="classes">
        <pl-list direction="top">
            <pl-item v-for="(item,index) in items" :key="item.id">
                <pl-notice v-bind="item" :data="item" @done="pl_done(index)"/>
            </pl-item>
        </pl-list>
    </div>
</template>

<script>
    import PlNotice from "./pl-notice";
    import PlList from "../list/pl-list";
    import PlItem from "../list/pl-item";

    export default {
        name: "pl-notice-container",
        components: {PlItem, PlList, PlNotice},
        data() {
            return {
                vertical: null,
                horizontal: null,
                items: [],
            }
        },
        computed: {
            classes() {
                return [
                    `pl-notice-container-${this.vertical}-${this.horizontal}`
                ]
            },
        },
        methods: {
            show(option) {
                option.id = this.$plain.$utils.uuid()
                this.items.push(option)
            },
            pl_done(index) {
                this.items.splice(index, 1)
            },
        }
    }
</script>