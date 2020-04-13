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
            color: $itc;
            height: 40px;

            & > div:nth-child(2) {
                width: 180px;
                text-align: center;

                .pl-button {
                    font-size: 14px;
                }

            }
        }
    }
</style>