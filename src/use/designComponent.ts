import {Component, ComponentPropsOptions, defineComponent, Directive, ExtractPropTypes, inject, provide, SetupContext,} from 'vue'
import {ComponentEvent, getComponentEmit, useEvent} from "@/use/useEvent.";
import {createError} from "@/utils/createError";
import {renderNothing} from "@/utils/renderNothing";

const error = createError('designComponent')

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
                const {refer, render} = setup({
                    props,
                    event: useEvent<Emits>(emits!),
                    setupContext,
                })
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
        }
    }
}