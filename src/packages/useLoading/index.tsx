import {useLoadingMask} from "./full";
import {useLoadingBar} from "./bar";

export function useLoading() {
    const mask = useLoadingMask()
    const bar = useLoadingBar()
    return {
        full: mask,
        bar: bar,
    }
}

export default useLoading