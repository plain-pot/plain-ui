<template>
    <div class="pl-row" :class="classes" :style="styles">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-row",
        props: {
            type: {type: String},                               //类型,type
            align: {type: String},                              //对其方式,left|center|right
            justify: {type: String},                            //内容弹性布局方式,start,end,center,space-around,space-between
            gutter: {type: [String, Number], default: 0},       //间隔
        },
        watch: {
            gutter(val) {
                this.updateGutter(val);
            }
        },
        computed: {
            classes() {
                return [
                    {
                        [`pl-row-${this.type}`]: !!this.type,
                        [`pl-row-${this.type}-${this.align}`]: !!this.align,
                        [`pl-row-${this.type}-${this.justify}`]: !!this.justify,
                    }
                ]
            },
            styles() {
                let style = {};
                if ((this.gutter - 0) !== 0) {
                    style = {
                        marginLeft: (this.gutter - 0) / -2 + 'px',
                        marginRight: (this.gutter - 0) / -2 + 'px'
                    };
                }
                return style;
            },
        },
        methods: {
            updateGutter(val) {
                const Cols = this.$plain.$dom.findComponentsDownward(this, 'pl-col');
                if (Cols.length) {
                    Cols.forEach((child) => {
                        if ((val - 0) !== 0) {
                            child.gutter = (val - 0);
                        }
                    });
                }
            }
        },
    }
</script>

<style lang="scss">

    $screen-sm: 768px;
    $screen-md: 992px;
    $screen-lg: 1200px;
    $screen-xl: 1920px;
    $cell-num: 24;
    $flexs: (
            start:(justify-content:flex-start),
            center:(justify-content:center),
            end:(justify-content:flex-end),
            space-between:(justify-content:space-between),
            space-around:(justify-content:space-around),
            top:(align-items:flex-start),
            middle:(align-items:center),
            bottom:(align-items:flex-end),
    );
    $screens: (
            xs:(max-width:$screen-sm),
            sm:(min-width:$screen-sm),
            md:(min-width:$screen-md),
            lg:(min-width:$screen-lg),
            xl:(min-width:$screen-xl),
    );

    @mixin res($key, $map: $screens) {
        // 循环断点Map，如果存在则返回
        @if map-has-key($map, $key) {
            @media only screen and #{inspect(map-get($map, $key))} {
                @content;
            }
        } @else {
            @warn "Undefeined points: `#{$map}`";
        }
    }

    .pl-row {
        height: auto;
        position: relative;
        display: block;

        &:not(:last-child) {
            margin-bottom: 16px;
        }

        &, & * {
            box-sizing: border-box;
        }

        /*flex布局*/
        &.pl-row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            &:before,
            &:after {
                display: flex;
            }

            /*flex布局*/
            @each $flexType, $flexValue in $flexs {
                &.pl-row-flex-#{$flexType} {
                    @each $key, $value in $flexValue {
                        #{$key}: #{$value}
                    }
                }
            }
        }

        /*响应式*/
        .pl-col {
            display: block;
            float: left;

            @for $i from 1 through $cell-num {
                &.pl-col-span-#{$i} {
                    width: (1 / $cell-num * $i * 100) * 1%;
                }
                &.pl-col-offset-#{$i} {
                    margin-left: (1 / $cell-num * $i * 100) * 1%;
                }
                &.pl-col-pull-#{$i} {
                    position: relative;
                    right: (1 / $cell-num * $i * 100) * 1%;
                }
                &.pl-col-push-#{$i} {
                    position: relative;
                    left: (1 / $cell-num * $i * 100) * 1%;
                }
                &.pl-col-order-#{$i} {
                    order: $i;
                }
            }

            @each $size, $px in $screens {
                @include res(inspect($size)) {
                    @for $i from 1 through $cell-num {
                        &.pl-col-#{$size}-#{$i} {
                            width: (1 / $cell-num * $i * 100) * 1%;
                        }
                    }
                }
            }
        }
    }

    @each $size, $px in $screens {
        @include res(inspect($size)) {
            .hidden-#{$size}-only {
                display: none;
            }
        }
    }
</style>
