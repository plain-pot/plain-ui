import {Component, ComponentInternalInstance, ComponentOptionsMixin, ComponentPropsOptions, ComputedOptions, defineComponent, DefineComponent, Directive, EmitsOptions, ExtractPropTypes, getCurrentInstance, inject, MethodOptions, PropType, provide, Ref, ref, SetupContext,} from 'vue'
import {ComponentEvent, getComponentEmit, useEvent} from "./useEvent";
import {createError} from "../utils/createError";
import {renderNothing} from "../utils/renderNothing";

const error = createError('designComponent')

interface RefValue<T> {
    (): Ref<null | T>

    (refName?: string): Readonly<{ value: null | T }>
}

interface InjectValue<Refer> {
    (): Refer,

    <DefaultValue>(defaultValue?: DefaultValue): Refer | DefaultValue
}

interface UseType<Refer, Props> {
    ref: RefValue<Refer>,
    inject: InjectValue<Refer>
    class: Refer,
    props: Props,
}

type EmitToProp<E extends Record<string, any>> = {
    [k in keyof E]: { type: PropType<E[k] extends ((...args: any[]) => any) ? (...args: Parameters<E[k]>) => void : E[k]>, }
}

export function designComponent<RawBindings,
    D,
    Refer,
    Expose extends object,
    Props extends Readonly<ExtractPropTypes<PropsOptions>>,
    PropsOptions extends Readonly<ComponentPropsOptions> = {},
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
    E extends EmitsOptions = {},
    EE extends string = string,
    >(
    options: {
        provideRefer?: boolean,
        emits?: E,
        setup?: (parameter: { props: Props, event: ComponentEvent<E>, setupContext: SetupContext<E>, ctx: ComponentInternalInstance }) => {
            refer?: Refer
            render: () => any,
        },

        name?: string,
        props?: PropsOptions,
        mixins?: any[],
        components?: Record<string, Component>;
        directives?: Record<string, Directive>;
    },
    expose?: Expose,
): DefineComponent<PropsOptions & EmitToProp<E>, RawBindings, D, C, M, Mixin, Extends, E, EE> & {
    use: UseType<Refer, Props>
} & Expose {

    const {provideRefer, emits, setup, ...leftOptions} = options

    const use: UseType<Refer, Props> = {
        inject: (defaultValue?: any) => {
            return inject(`@@${options.name}`, defaultValue) as Refer
        },
        class: Object as any as Refer,
        ref: (refName?: string) => {
            if (!!refName) {
                const ctx = getCurrentInstance()!
                return {
                    get value() {
                        return ctx.refs[refName!]
                    }
                } as any
            } else {
                return ref(null)
            }
        },
        props: Object as any as Props,
    }

    /*if (leftOptions.name === 'pl-popper') {
        console.log(leftOptions.name, getComponentEmit(emits), emits)
    }*/

    return Object.assign(
        defineComponent({
            ...(leftOptions as any || {}),
            props: leftOptions.props as PropsOptions,
            emits: getComponentEmit(emits),
            setup(props: any, setupContext: any) {
                if (!setup) {
                    error('setup is necessary!')
                    return renderNothing
                }
                const ctx = getCurrentInstance()!
                const event = useEvent<E>(emits!);
                (ctx as any)._event = event;

                const {refer, render} = setup({
                    ctx,
                    props,
                    event,
                    setupContext,
                })

                if (!!refer) {
                    const duplicateKey = Object.keys(refer || {}).find(i => i in ctx.proxy!)
                    if (!!duplicateKey) {
                        console.error(`designComponent:${leftOptions.name} key '${duplicateKey}' in refer is not allow here!`)
                    } else {
                        Object.assign(ctx.proxy, refer)
                    }
                }

                if (provideRefer) {
                    if (!options.name) {
                        error('component name is necessary when provideRefer is true!')
                    } else {
                        provide(`@@${options.name}`, refer)
                    }
                }
                return render
            },
        }),
        {use, ...(expose || {})}
    ) as any
}