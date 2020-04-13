<template>
    <div class="pl-date-base-panel-date">
        <pl-date-base-panel-header>
            <div slot="left">
                <pl-button icon="el-icon-d-arrow-left" mode="text"/>
                <pl-button icon="el-icon-arrow-left" mode="text"/>
            </div>
            <div slot="center">
                <pl-button label="2020年04月" mode="text"/>
            </div>
            <div slot="right">
                <pl-button icon="el-icon-arrow-right" mode="text"/>
                <pl-button icon="el-icon-d-arrow-right" mode="text"/>
            </div>
        </pl-date-base-panel-header>
    </div>
</template>

<script>
    import PlDateBasePanelHeader from "./pl-date-base-panel-header";

    export default {
        name: "pl-date-base-panel-date",
        components: {PlDateBasePanelHeader},
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-date-base-panel-date {
            border: solid 1px $ibc;
            border-radius: 2px;
            display: inline-block;
        }
    }
</style>