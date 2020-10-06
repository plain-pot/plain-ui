import {SetupFunction} from "@/use/designComponent"

declare function designComponent<Props extends ComponentPropsOptions,
    Setup extends (this: String, ...args: Parameters<SetupFunction<ExtractPropTypes<Props>, Data>>) => any,
    Render extends (refer: ReturnType<Setup>) => any,
    >(
    props: Props,
    setup: Setup,
    render: Render,
);

designComponent({
    name: {type: String},

    age: {type: Number, required: true},
    level: {type: String, default: 1},
}, function (props) {
    return {
        ...props,
        amdYes: 123,
    }
}, function (refer) {
    console.log(refer.amdYes)
})