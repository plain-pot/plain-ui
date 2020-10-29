import {Component, ComponentPropsOptions, defineComponent, Directive, ExtractPropTypes, inject, provide, SetupContext, getCurrentInstance, Ref, ref,} from 'vue'
import {ComponentEvent, getComponentEmit, useEvent} from "./useEvent";
import {createError} from "../utils/createError";
import {renderNothing} from "../utils/renderNothing";

const error = createError('designComponent')

export function designComponent<PropsOptions extends Readonly<ComponentPropsOptions>,
    Props extends Readonly<ExtractPropTypes<PropsOptions>>,
    Emits extends { [k: string]: (...args: any[]) => boolean },
    Refer,
    >(
    options: {
        provideRefer?: boolean,
        emits?: Emits,
        setup?: (parameter: { props: Props, event: ComponentEvent<Emits>, setupContext: SetupContext<Emits> }) => {
            refer?: Refer
            render: () => any,
        },

        name?: string,
        props?: PropsOptions,
        mixins?: any[],
        components?: Record<string, Component>;
        directives?: Record<string, Directive>;
    }) {

    const {provideRefer, emits, setup, ...leftOptions} = options

    return {
        ...defineComponent({
            ...(leftOptions as any || {}),
            emits: getComponentEmit(emits),
            setup(props: any, setupContext: any) {
                if (!setup) {
                    error('setup is necessary!')
                    return renderNothing
                }
                const ctx = getCurrentInstance()!
                const event = useEvent<Emits>(emits!)

                const {refer, render} = setup({
                    props,
                    event,
                    setupContext,
                })

                if (!!refer) {
                    const duplicateKey = Object.keys(leftOptions.props || {})
                        .find(i => Object.prototype.hasOwnProperty.call(refer as any, i))
                    if (!!duplicateKey) {
                        console.error(`designComponent: duplicate key ${duplicateKey} in refer`)
                    } else {
                        Object.assign(ctx.proxy, refer)
                    }
                }

                (ctx as any)._event = event

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
        use: {
            inject: (defaultValue?: any) => {
                return inject(`@@${options.name}`, defaultValue) as Refer
            },
            class: Object as any as Refer,

            /*not reactive data*/
            ref: (refName?: string): Ref<Refer | null> => {
                if (!!refName) {
                    const ctx = getCurrentInstance() as any
                    return {
                        get value() {
                            return ctx.refs[refName!] as Refer | null
                        }
                    } as any
                } else {
                    return ref(null)
                }
            }
        }
    }
}