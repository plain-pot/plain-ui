export const StepUtils = {
    getCurrentIndex: (current: any, items: any[]) => {
        if (typeof current === "number") {
            return current
        } else {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.val === current) return i
            }
        }
    },
}