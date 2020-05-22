import {defineComponent, getCurrentInstance, ref} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {PopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";

export interface PopperController {
    getInstance: () => Promise<PopperServiceComponent>
}

export function usePopperController(name: string, PSC: any) {
    return defineComponent({
        name,
        setup() {
            const count = ref(0)

            const ctx = getCurrentInstance()

            const refs = useRefs({
                items: [] as any[],
            })

            Object.assign(ctx, {
                async getInstance() {
                    let service = refs.items.find(item => !item.state.show && !item.state.open && !item.isPrivate.value)
                    if (!service) {
                        count.value++
                        await $plain.nextTick()
                        return await this.getInstance()
                    } else {
                        return service
                    }
                },
            })

            return () => (
                <div class={[name, 'pl-service-controller']}>
                    {new Array(count.value).fill(0).map((item, index) => <PSC {...{key: index, ref: 'items', refInFor: true}}/>)}
                </div>
            )
        },
    })
}