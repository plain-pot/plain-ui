import {designComponent, PropType, useRefs, useStyles} from "plain-ui-composition"
import {PlRow} from "../PlRow";
import {useClasses} from "plain-ui-composition";
import {SingleClass} from "plain-ui-composition"


export type GridColSize = number | {
    span: number,
    offset: number,
}

export const PlCol = designComponent({
    name: 'pl-col',
    props: {
        span: {type: [Number, String] as PropType<string | number>},
        order: {type: [Number, String] as PropType<string | number>},
        offset: {type: [Number, String] as PropType<string | number>},
        push: {type: [Number, String] as PropType<string | number>},
        pull: {type: [Number, String] as PropType<string | number>},
        className: String,
        xs: {type: [Number, Object] as PropType<GridColSize>},
        sm: {type: [Number, Object] as PropType<GridColSize>},
        md: {type: [Number, Object] as PropType<GridColSize>},
        lg: {type: [Number, Object] as PropType<GridColSize>},
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const row = PlRow.use.inject()
        const classes = useClasses(() => {
            let classList = [
                'pl-col',
                {
                    [`pl-col-span-${props.span}`]: props.span,
                    [`pl-col-order-${props.order}`]: props.order,
                    [`pl-col-offset-${props.offset}`]: props.offset,
                    [`pl-col-push-${props.push}`]: props.push,
                    [`pl-col-pull-${props.pull}`]: props.pull,
                    [`${props.className}`]: !!props.className
                }
            ] as SingleClass[];

            const sizeProps = props;
            (['xs', 'sm', 'md', 'lg'] as ['xs', 'sm', 'md', 'lg']).forEach(size => {
                if (typeof sizeProps[size] === 'number') {
                    classList.push(`pl-col-${size}-${sizeProps[size]}`);
                } else if (typeof sizeProps[size] === 'object') {
                    let obj = sizeProps[size];
                    !!obj && Object.entries(obj).forEach(([key, val]) => classList.push(key !== 'span' ? `pl-col-${size}-${key}-${val}` : `pl-col-span-${size}-${val}`))
                }
            });
            return classList;
        })
        const styles = useStyles(style => {
            if ((Number(row.props.gutter)) !== 0) {
                style = {
                    paddingLeft: (Number(row.props.gutter)) / 2 + 'px',
                    paddingRight: (Number(row.props.gutter)) / 2 + 'px'
                };
            }
            return style;
        })

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class={classes.value} style={styles.value} ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlCol
