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

        $width: 276px;

        .pl-date-base-panel {

            border: solid 1px $ibc;
            border-radius: 2px;
            display: inline-block;
            padding: 8px 12px 12px 12px;

            .pl-date-base-panel-header {
                width: $width;
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
                display: flex;
                align-items: center;
                justify-content: center;
                width: $width;
                height: 220px;
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
                position: relative;
                overflow: hidden;
            }

            .pl-transition-slide-next-enter-active, .pl-transition-slide-next-leave-active {
                transform: translate3d(0, 0, 0);
            }

            .pl-transition-slide-next-enter {
                transform: translate3d(100%, 0, 0);
            }

            .pl-transition-slide-next-leave-to {
                transform: translate3d(-100%, 0, 0);
            }

            .pl-transition-slide-prev-enter-active, .pl-transition-slide-prev-leave-active {
                transform: translate3d(0, 0, 0);
            }

            .pl-transition-slide-prev-enter {
                transform: translate3d(-100%, 0, 0);
            }

            .pl-transition-slide-prev-leave-to {
                transform: translate3d(100%, 0, 0);
            }

            .pl-date-base-panel-year-list {
                transition: all $transition 1000ms;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;

                .pl-date-base-panel-year-item {
                    width: 63px;
                    height: 36px;
                    cursor: pointer;
                    padding: 3px;
                    box-sizing: border-box;

                    & > div {
                        width: 100%;
                        height: 100%;
                        padding: 3px;
                        box-sizing: border-box;
                        border-radius: 100px;

                        span {
                            display: inline-flex;
                            width: 100%;
                            height: 100%;
                            border-radius: 100px;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    &:hover {
                        & > div {
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

            .pl-date-base-panel-body {
                flex-direction: column;
            }

            ul {
                &.pl-date-base-panel-date-week-list {
                    border-bottom: solid 1px $ibl;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }

                &.pl-date-base-panel-date-date-list, &.pl-date-base-panel-date-week-list {
                    width: 100%;
                    padding: 0 ($width - 36*7)/2;
                }

                li {
                    &, & span {
                        transition: all $transition 300ms;
                    }

                    &.pl-date-base-panel-date-item {
                        width: 36px;
                        height: 30px;
                        cursor: pointer;
                        padding: 0 3px;
                        box-sizing: border-box;

                        & > div {
                            width: 100%;
                            height: 100%;
                            align-items: center;
                            justify-content: center;
                            display: inline-flex;
                            padding: 3px;
                            box-sizing: border-box;
                        }

                        span {
                            width: 100%;
                            height: 100%;
                            align-items: center;
                            justify-content: center;
                            display: inline-flex;
                        }
                    }
                }

                &.pl-date-base-panel-date-date-list {
                    overflow: hidden;

                    li {

                        &:hover {
                            & > div {
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