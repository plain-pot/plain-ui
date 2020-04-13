<template>
    <div class="pl-date">
        pl-date
    </div>
</template>

<script>
    export default {
        name: "pl-date",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {

        .pl-date-base-panel {

            border: solid 1px $ibc;
            border-radius: 2px;
            display: inline-block;
            padding: 8px 12px 12px 12px;

            .pl-date-base-panel-header {
                width: 276px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                color: $itc;
                height: 40px;

                & > div:nth-child(2) {
                    flex: 1;
                    text-align: center;

                    span {
                        padding: 3px 8px;
                        transition: all $transition 300ms;

                        &:hover {
                            box-shadow: plvar(boxShadow);
                            cursor: pointer;
                            border-radius: 100px;
                        }
                    }

                    & span:nth-child(2) {
                        margin-left: 8px;
                    }
                }

                .pl-button {
                    color: $icc !important;

                    &:hover {
                        color: $colorPrimary !important;
                    }
                }
            }

            .pl-date-base-panel-body {
                width: 252px;
                height: 220px;
                margin: auto;
            }

            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                display: block;

                li {
                    display: inline-block;
                    font-size: 12px;
                    color: $itc;
                }
            }

        }

        .pl-date-base-panel-year {
            .pl-date-base-panel-body {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pl-date-base-panel-year-list {
                transition: all $transition 30ms;

                .pl-date-base-panel-year-item {
                    width: 25%;
                    text-align: center;
                    height: 36px;
                    line-height: 36px;
                    margin-bottom: 4px;
                    cursor: pointer;

                    span {
                        display: inline-block;
                        height: 24px;
                        line-height: 24px;
                        padding: 0 8px;
                        border-radius: 100px;
                    }

                    &:hover {
                        span {
                            background-color: rgba($colorPrimary, 0.1);
                        }
                    }

                    &.pl-date-base-panel-year-item-now {
                        color: $colorPrimary;
                        font-weight: bold;
                    }

                    &.pl-date-base-panel-year-item-active {
                        span {
                            background-color: $colorPrimary;
                            color: white;
                        }
                    }
                }
            }
        }

        .pl-date-base-panel-date {
            ul {
                &.pl-date-base-panel-date-week-list {
                    border-bottom: solid 1px $ibc;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }

                &.pl-date-base-panel-date-date-list, &.pl-date-base-panel-date-week-list {
                    width: 36*7px;
                }

                li {
                    &, & span {
                        transition: all $transition 300ms;
                    }

                    &.pl-date-base-panel-date-item {
                        width: 36px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        cursor: pointer;

                        span {
                            display: inline-block;
                            width: 24px;
                            height: 24px;
                            text-align: center;
                            line-height: 24px;
                        }
                    }
                }

                &.pl-date-base-panel-date-date-list {
                    overflow: hidden;

                    li {

                        &:hover {
                            span {
                                background-color: rgba($colorPrimary, 0.1);
                                border-radius: 100px;
                            }
                        }

                        &.pl-date-base-panel-date-item-today {
                            color: $colorPrimary;
                            font-weight: bold;
                        }

                        &.pl-date-base-panel-date-item-active {
                            span {
                                background-color: $colorPrimary;
                                color: white;
                                font-weight: bold;
                                border-radius: 100px;
                            }
                        }

                        &:not(.pl-date-base-panel-date-item-select-month) {
                            opacity: 0.2;
                        }
                    }
                }
            }
        }
    }
</style>