<template>
    <div class="pl-col" :class="classes" :style="styles">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-col",
        props: {
            span: [Number, String],
            order: [Number, String],
            offset: [Number, String],
            push: [Number, String],
            pull: [Number, String],
            className: String,
            xs: [Number, Object],
            sm: [Number, Object],
            md: [Number, Object],
            lg: [Number, Object]
        },
        inject: {
            plRow: {},
        },
        data() {
            return {
                gutter: 0,
            }
        },
        computed: {
            classes() {
                let classList = [
                    {
                        [`pl-col-span-${this.span}`]: this.span,
                        [`pl-col-order-${this.order}`]: this.order,
                        [`pl-col-offset-${this.offset}`]: this.offset,
                        [`pl-col-push-${this.push}`]: this.push,
                        [`pl-col-pull-${this.pull}`]: this.pull,
                        [`${this.className}`]: !!this.className
                    }
                ];
                ['xs', 'sm', 'md', 'lg'].forEach(size => {
                    if (typeof this[size] === 'number') {
                        classList.push(`pl-col-${size}-${this[size]}`);
                    } else if (typeof this[size] === 'object') {
                        let props = this[size];
                        Object.keys(props).forEach(prop => {
                            classList.push(
                                prop !== 'span'
                                    ? `pl-col-${size}-${prop}-${props[prop]}`
                                    : `pl-col-span-${size}-${props[prop]}`
                            );
                        });
                    }
                });
                return classList;
            },
            styles() {
                let style = {};
                if ((Number(this.gutter)) !== 0) {
                    style = {
                        paddingLeft: (Number(this.gutter)) / 2 + 'px',
                        paddingRight: (Number(this.gutter)) / 2 + 'px'
                    };
                }
                return style;
            }
        },
        methods: {
            updateGutter() {
                if (!!this.plRow) {
                    this.plRow.updateGutter(this.plRow.gutter);
                }
            }
        },
        mounted() {
            if (!!this.plRow) {
                this.plRow.addItem(this)
            }
            this.updateGutter();
        },
        beforeDestroy() {
            if (!!this.plRow) {
                this.plRow.removeItem(this)
            }
            this.updateGutter();
        }
    }
</script>