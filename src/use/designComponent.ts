import {Component, ComponentPropsOptions, defineComponent, Directive, ExtractPropTypes, inject, provide, SetupContext, getCurrentInstance,} from 'vue'
import {ComponentEvent, getComponentEmit, useEvent} from "./useEvent";
import {createError} from "../utils/createError";
import {renderNothing} from "../utils/renderNothing";
import * as Vue from 'vue'

const error = createError('designComponent')

console.log(Vue);

export function designComponent<PropsOptions extends Readonly<ComponentPropsOptions>, Props extends Readonly<ExtractPropTypes<PropsOptions>>, Emits extends { [k: string]: (...args: any[]) => void }, Refer, >(
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
                const ctx = getCurrentInstance() as any
                const {refer, render} = setup({
                    props,
                    event: useEvent<Emits>(emits!),
                    setupContext,
                })
                ctx._refer = refer
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
            ref: (refName: string): { value: Refer | null } => {

                const ctx = getCurrentInstance() as any

                return {
                    get value() {
                        const flag = process.env.NODE_ENV === 'production'
                        console.log('flag',flag)
                        if (flag) {
                            console.log('is production')
                            return ctx.ctx._.refs[refName]._._refer as Refer || null
                        } else {
                            console.log('not production')
                            return ctx.refs[refName].$._refer as Refer || null
                        }
                    }
                }
            }
        }
    }
}