/**
 * is slot is string
 * @author  韦胜健
 * @date    2021/3/18 17:56
 */
export function isis(slotFunc: () => any, renderString: (str: string) => any, defaultSlot?: any) {
    const slot = slotFunc()
    if (slot == null) return defaultSlot
    return typeof slot === "string" ? renderString(slot) : slot
}