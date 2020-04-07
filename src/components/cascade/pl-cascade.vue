<template>
    <div class="pl-cascade">
        pl-cascade
    </div>
</template>

<script>
    export default {
        name: "pl-cascade",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">


    @include themify {
        .pl-cascade-panel {
            display: inline-block;
            height: 200px;
            border: solid 1px $ibc;
            border-radius: 2px;

            .pl-cascade-list {
                width: 180px;
                height: 100%;
                padding: 6px 0;
                font-size: 14px;
                border-right: solid 1px $ibc;
                display: inline-block;
                vertical-align: top;

                &:last-child {
                    border-right: none;
                }

                .pl-list {
                    overflow: hidden;
                }

                .pl-cascade-item {
                    padding: 4px 6px 4px 16px;
                    transition: all 300ms $transition;
                    cursor: pointer;

                    .pl-cascade-content {
                        padding-right: 30px;
                        position: relative;

                        .pl-cascade-arrow {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 0;
                            width: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: $icc;
                        }
                    }

                    &:hover {
                        background-color: rgba($colorPrimary, 0.1);
                        color: $colorPrimary;

                        .pl-cascade-arrow {
                            color: $colorPrimary;
                        }
                    }

                    &.pl-cascade-item-expand {
                        color: $colorPrimary;
                        background-color: rgba($colorPrimary, 0.1);

                        .pl-cascade-arrow {
                            color: $colorPrimary;
                        }
                    }

                    &.pl-cascade-empty {
                        padding-right: 0;
                        padding-left: 0;
                        text-align: center;
                        font-size: 12px;
                        color: $disabledText;
                        background-color: transparent;
                        cursor: auto;

                        .pl-icon {
                            margin-right: 3px;
                        }
                    }
                }
            }
        }
    }

</style>