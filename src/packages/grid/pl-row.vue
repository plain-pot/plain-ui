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
        provide() {
            return {
                plRow: this,
            }
        },
        data() {
            return {
                items: [],
            }
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
            /**
             * 收集子组件
             * @author  韦胜健
             * @date    2020/3/4 19:09
             */
            addItem(item) {
                this.items.push(item)
            },
            /**
             * 删除子组件
             * @author  韦胜健
             * @date    2020/3/4 19:09
             */
            removeItem(item) {
                const index = this.items.indexOf(item)
                index > -1 && this.items.splice(index, 1)
            },
            updateGutter(val) {
                this.items.forEach((child) => {
                    if ((val - 0) !== 0) {
                        child.gutter = (val - 0);
                    }
                });
            }
        },
    }
</script>

<style lang="scss">
</style>
