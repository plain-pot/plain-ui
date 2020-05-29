import {$plain} from "@/packages/base";

export const StepUtils = {
    getCurrentIndex: (current: any, items: any[]) => {
        if (typeof current === "number") {
            return current
        } else {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.val === current) return item.state.index
            }
        }
    },
    getStepUtils: (items) => {
        const ret = {
            refreshStepIndex: $plain.utils.debounce((): void => {
                items.forEach(item => item.utils.refreshIndex())
            }, 100),
            addItem: (item) => {
                items.push(item)
                ret.refreshStepIndex()
            },
            removeItem: (item) => {
                items.splice(items.indexOf(item), 1)
                ret.refreshStepIndex()
            }
        }
        return ret
    }
}