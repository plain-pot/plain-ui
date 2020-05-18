import {computed, onBeforeUnmount, onMounted, reactive} from "@vue/composition-api";

export function useMounted() {
    const state = reactive({
        val: false,
    })
    const flag = computed(() => state.val)
    onMounted(() => state.val = true)
    onBeforeUnmount(() => state.val = false)
    return flag
}