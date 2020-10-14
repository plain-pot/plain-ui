import * as Vue from "vue/types/umd";
import {VNode} from "vue/types/umd";
import {defineComponent, getCurrentInstance, inject, provide, SetupContext} from "@vue/composition-api";

export type SetupFunction<Props, RawBindings = {}> = (this: void, props: Props, ctx: SetupContext) => RawBindings | (() => VNode | null) | void;

export function designComponent<Refer,
    Props extends ComponentPropsOptions,
    >
(config: {
    props?: Props,
    setup?: (this: Vue, ...args: Parameters<SetupFunction<ExtractPropTypes<Props>, Data>>) => {
        render: (h: typeof Vue.prototype.$createElement) => any,
        refer: Refer,
    },
    name?: string,
    provideRefer?: boolean,
    mixins?: any[],
    directives?: { [k: string]: any },
}) {

    const {
        props,
        setup,
        name,
        provideRefer,
        ...leftConfig
    } = config

    const componentSetup: any = (props: any) => {
        const ctx = getCurrentInstance() as any
        const {render = null, refer = {}} = !!setup ? setup.apply(ctx, [props, ctx]) : {}
        ctx._refer = refer
        if (!!provideRefer) {
            provide(`@@${name}`, refer)
        }
        return () => !!render ? render.apply(ctx, [ctx.$createElement]) : null
    }

    return Object.assign(defineComponent({
        name,
        props,
        setup: componentSetup,
        ...(leftConfig || {}),
    }), {
        use: {
            inject: (defaultValue?: any) => {
                return inject(`@@${name}`, defaultValue) as Refer
            },
            ref(refName: string): { value: (Refer | null) } {
                const ctx = getCurrentInstance()!
                return {
                    get value() {
                        if (!!ctx.$refs[refName]) {
                            return (ctx.$refs[refName] as any)._refer as Refer
                        } else {
                            return null
                        }
                    }
                }
            },
            refList(refName: string): { value: (Refer[]) } {
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
            class: Object as any as Refer,
        }
    })
}
