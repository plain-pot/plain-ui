import {ComponentOptionsBase, ComponentPropsOptions, ComponentRenderProxy, ComputedOptions, Data, HasDefined, MethodOptions, SetupFunction} from './composition-api';

declare function defineComponent<Props,
    RawBindings = Data,
    D = Data,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    PropsOptions extends ComponentPropsOptions = ComponentPropsOptions>(
    options: HasDefined<Props> extends true ?
        ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M, Props> :
        ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M>): any;

type ComponentOptionsWithProps<PropsOptions = ComponentPropsOptions,
    RawBindings = Data,
    D = Data,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Props = ExtractPropTypes<PropsOptions>,
    Setup = SetupFunction<Props, RawBindings>,
    > =
    {
        props?: PropsOptions;
        setup?: Setup;
    };

defineComponent({
    props: {
        name: {type: String},

        age: {type: Number, required: true},
        level: {type: String, default: 1},
    },
    setup(props) {

    },
})


/*
type DefineOptions<PropsOptions = ComponentPropsOptions,
    > = {
    setup: (props: ExtractPropTypes<PropsOptions>) => any,
}

export function design<Props,
    PropsOptions extends ComponentPropsOptions = ComponentPropsOptions,
    >
(
    props: PropsOptions,
    options: DefineOptions<PropsOptions>
) {

}

const Props = {
    name: {type: String},

    age: {type: Number, required: true},
    level: {type: String, default: 1},
}

design(Props, {
    setup(props) {

    },
})*/
