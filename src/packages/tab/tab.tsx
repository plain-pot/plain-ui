import {defineComponent, inject, onBeforeUnmount, onMounted, reactive} from "@vue/composition-api";
import {TAB_GROUP_PROVIDER} from "@/packages/tab/tab-group";
import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},
        val: {},
    },
    setup(props) {

        const tabGroup = inject(TAB_GROUP_PROVIDER) as any
        const refs = useRefs()

        const methods = {
            getIndex: () => {
                return Array
                    .from(refs.$el!.parentNode!.childNodes)
                    .filter((item: any) => item.nodeName !== '#comment' && (!item.style || item.style.display !== 'none'))
                    .indexOf(refs.$el)
            }
        }

        const ctx = useRefer({
            props,
            methods,
        })

        onMounted(() => {
            tabGroup.utils.addItem(ctx)
        })

        onBeforeUnmount(() => {
            tabGroup.utils.removeItem(ctx)
        })

        return () => <span>{props.title}</span>
    },
})