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
        .pl-date-base-panel-date {
            border: solid 1px $ibc;
            border-radius: 2px;
            display: inline-block;
            padding: 8px 12px 12px 12px;

            .pl-date-base-panel-header {
                & > div:nth-child(2) {
                    span {
                        padding: 3px 8px;

                        &:hover {
                            box-shadow: plvar(boxShadow);
                            border-radius: 2px;
                            cursor: pointer;
                        }
                    }

                    & span:nth-child(2) {
                        margin-left: 8px;
                    }
                }
            }

            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                display: block;

                &.pl-date-base-panel-date-week-list {
                    border-bottom: solid 1px $ibc;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }

                &.pl-date-base-panel-date-date-list, &.pl-date-base-panel-date-week-list {
                    width: 36*7px;
                    margin-left: auto;
                    margin-right: auto;
                }

                li {
                    display: inline-block;
                    font-size: 12px;
                    color: $itc;

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

                    &.pl-date-base-panel-date-item-today {
                        color: $colorPrimary;
                        font-weight: bold;
                        position: relative;

                        &:after {
                            position: absolute;
                            top: 3px;
                            right: 3px;
                            content: '';
                            width: 5px;
                            height: 5px;
                            background-color: $colorPrimary;
                            border-radius: 3px;
                        }
                    }
                }
            }
        }
    }
</style>