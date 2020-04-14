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

                    &.pl-date-base-panel-item {
                        cursor: pointer;
                        box-sizing: border-box;

                        & > div {
                            width: 100%;
                            height: 100%;
                            padding: 4px;
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

                        &:hover:not(.pl-date-base-panel-item-disabled) {
                            & > div {
                                background-color: rgba($colorPrimary, 0.1);
                            }
                        }

                        &.pl-date-base-panel-item-now {
                            color: $colorPrimary;
                            font-weight: bold;
                        }

                        &.pl-date-base-panel-item-active {
                            & > div {
                                background-color: rgba($colorPrimary, 0.1);

                                & > span {
                                    background-color: $colorPrimary;
                                    color: white;
                                }
                            }
                        }

                        &.pl-date-base-panel-item-disabled {
                            cursor: not-allowed;
                            color: $disabledText;
                        }

                        &.pl-date-base-panel-item-hover-start {

                            & > div {
                                background-color: rgba($colorPrimary, 0.1);
                                border-radius: 100px 0 0 100px;
                            }
                        }

                        &.pl-date-base-panel-item-hover {

                            & > div {
                                background-color: rgba($colorPrimary, 0.1);
                                border-radius: 0;
                            }
                        }

                        &.pl-date-base-panel-item-hover-end {

                            & > div {
                                background-color: rgba($colorPrimary, 0.1);
                                border-radius: 0 100px 100px 0;
                            }

                            &.pl-date-base-panel-item-hover-start {
                                & > div {
                                    border-top-left-radius: 100px;
                                    border-bottom-left-radius: 100px;
                                }

                            }
                        }
                    }
                }
            }

        }

        .pl-date-base-panel-year {
            .pl-date-base-panel-body {
                position: relative;
                overflow: hidden;
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
                }
            }
        }

        .pl-date-base-panel-month {

            .pl-date-base-panel-body {
                position: relative;
                overflow: hidden;
            }

            .pl-date-base-panel-month-list {
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

                .pl-date-base-panel-month-item {
                    width: 92px;
                    height: 36px;
                    padding: 3px 5px;
                }
            }
        }

        .pl-date-base-panel-date {

            .pl-date-base-panel-body {
                flex-direction: column;
            }

            ul {
                $itemWidth: 36px;
                $itemHeight: 30px;

                &.pl-date-base-panel-date-week-list {
                    border-bottom: solid 1px $ibl;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                    width: $itemWidth*7;

                    .pl-date-base-panel-date-week-item {
                        width: $itemWidth;
                        height: $itemHeight;
                    }
                }

                &.pl-date-base-panel-date-list {
                    width: $itemWidth*7;

                    .pl-date-base-panel-date-item {
                        width: $itemWidth;
                        height: $itemHeight;
                        text-align: center;

                        & > div {
                            width: $itemHeight;
                            height: $itemHeight;
                            display: inline-block;
                            padding: 3px;
                        }

                        &, & span {
                            transition: all $transition 300ms;
                        }

                        &.pl-date-base-panel-date-item-other-month {
                            opacity: 0.2;
                        }
                    }
                }
            }
        }
    }
</style>