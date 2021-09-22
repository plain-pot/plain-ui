import {PlainScroll} from "../../../PlScroll";

export function useTableGetScroll(onVirtualMounted: (cb: (data: { scroll: PlainScroll }) => void) => void, onChange?: (scroll: PlainScroll) => void) {
    let val: PlainScroll
    onVirtualMounted(({scroll}) => {
        val = scroll;
        !!onChange && onChange(scroll)
    })
    return {
        getScroll: () => val!
    }
}