import {defineComponent, getCurrentInstance, inject, provide, SetupContext} from "@vue/composition-api";
import * as Vue from "vue/types/umd";
import {VNode} from "vue";

export type SetupFunction<Props, RawBindings = {}> = (this: void, props: Props, ctx: SetupContext) => RawBindings | (() => VNode | null) | void;

export function designComponent<Props extends ComponentPropsOptions,
    Setup extends (this: Vue, ...args: Parameters<SetupFunction<ExtractPropTypes<Props>, Data>>) => any,
    Render extends (this: Vue, refer: ReturnType<Setup>) => any,
    Config extends { provide?: boolean, mixin?: any },
    >(
    name: string,
    props: Props,
    setup: Setup,
    render: Render,
    config?: Config,
) {
    return {
        ...defineComponent({
            mixins: !!config && !!config.mixin ? [config.mixin] : [],
            name,
            props: props as any,
            setup: (p, sctx) => {
                const ctx = getCurrentInstance()!
                // @ts-ignore
                ctx.h = ctx.$createElement
                const _refer = setup.apply(ctx, [p as any, sctx])
                if (!!config && config.provide) {
                    provide(`@@${name}`, _refer)
                }
                Object.assign(ctx, {_refer})
                return render.apply(ctx, [_refer])
            }
        }),
        use: {
            inject: (defaultValue?: any) => {
                return inject(`@@${name}`, defaultValue) as ReturnType<any>
            },
            ref(refName: string): { value: (ReturnType<Setup> | null) } {
                const ctx = getCurrentInstance()!
                return {
                    get value() {
                        if (!!ctx.$refs[refName]) {
                            return (ctx.$refs[refName] as any)._refer as ReturnType<Setup>
                        } else {
                            return null
                        }
                    }
                }
            },
            refList(refName: string): { value: (ReturnType<Setup>[]) } {
                const ctx = getCurrentInstance()!
                return {
                    get value() {
                        if (!!ctx.$refs[refName]) {
                            const insList = ctx.$refs[refName] as any[]
                            return insList.map(item => item._refer)
                        } else {
                            return [] as any[]
                        }
                    }
                }
            },
        },
    }
}