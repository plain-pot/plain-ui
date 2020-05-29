import {computed, onBeforeUnmount, onMounted, reactive} from "@vue/composition-api";
import {useWrapper} from "@/use/useWrapper";

export const useMounted = useWrapper('mounted', () => {
    const state = reactive({
        val: false,
    })
    const flag = computed(() => state.val)
    onMounted(() => state.val = true)
    onBeforeUnmount(() => state.val = false)
    return flag
})