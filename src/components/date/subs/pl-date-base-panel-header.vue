<template>
    <div class="pl-date-base-panel-header">
        <div>
            <slot name="left"/>
        </div>
        <div>
            <slot name="center"/>
        </div>
        <div>
            <slot name="right"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-date-base-panel-header",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-date-base-panel-header {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: $itc;

            & > div:nth-child(2) {
                flex: 1;
            }
        }
    }
</style>