<template>
    <div class="pl-notice-container"
         :class="classes">
        <pl-list direction="top">
            <pl-item v-for="(item) in items" :key="item.id">
                <pl-notice v-bind="item" :data="item"/>
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

            },
        },
        methods: {
            show(option) {
                option.id = this.$plain.$utils.uuid()
                this.items.push(option)
            },
        }
    }
</script>