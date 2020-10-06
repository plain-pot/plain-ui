import {SetupFunction} from "@/use/designComponent"
import * as Vue from "vue/types/umd";

/*@formatter:off*/
export function paramComponent<
    Props extends ComponentPropsOptions,
    Setup extends (this: Vue, ...args: Parameters<SetupFunction<ExtractPropTypes<Props>, Data>>) => any,
    Render extends (this: Vue, refer: Setup extends (...args: any[]) => infer R ? R : unknown) => any,
    >
(props:Props,setup:Setup,render:Render) {}
/*@formatter:on*/

/*@formatter:off*/
export function optionComponent<
    Props extends ComponentPropsOptions,
    Setup extends (this: Vue, ...args: Parameters<SetupFunction<ExtractPropTypes<Props>, Data>>) => any,
    Render extends (this: Vue, refer: Setup extends (...args: any[]) => infer R ? R : unknown) => any,
    >
(options:{props:Props,setup:Setup,render:Render}) {}
/*@formatter:on*/

paramComponent({
    name: {type: String},

    age: {type: Number, required: true},
    level: {type: String, default: 1},
}, function (props) {
    return {
        ...props,
        amdYes: 123,
    }
}, function (refer) {

})

optionComponent({
    props: {
        name: {type: String},

        age: {type: Number, required: true},
        level: {type: String, default: 1},
    },
    setup(props) {
        return {
            ...props,
            amdYes: 123,
        }
    },
    render(refer) {

    },
})