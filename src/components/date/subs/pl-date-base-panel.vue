<template>
    <div class="pl-date-base-panel">
        <pl-date-base-panel-header>
            <slot name="left" slot="left"/>
            <slot name="center" slot="center"/>
            <slot name="right" slot="right"/>
        </pl-date-base-panel-header>
        <div class="pl-date-base-panel-body">
            <slot name="content"/>
        </div>
    </div>
</template>

<script>
    import PlDateBasePanelHeader from "./pl-date-base-panel-header";

    export default {
        name: "pl-date-base-panel",
        components: {PlDateBasePanelHeader},
    }
</script>