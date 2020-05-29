import {StepStatus} from "@/packages/step/step";

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
    getStepStatus: (group: { currentStatus, currentIndex }, child: { status, index }): StepStatus | null => {

        const {currentStatus, currentIndex} = group
        const {status, index} = child

        if (!!status) return status as StepStatus
        if (currentIndex.value > index.value) {
            return StepStatus.finish
        } else if (currentIndex.value === index.value) {
            if (!!currentStatus) {
                return currentStatus as StepStatus
            } else {
                return StepStatus.process
            }
        } else if (currentIndex.value < index.value) {
            return StepStatus.wait
        } else {
            return null
        }
    }
}