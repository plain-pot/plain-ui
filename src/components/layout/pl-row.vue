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
</style>
