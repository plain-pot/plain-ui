import {iUseHttp} from "./useHttp.utils";
import {getInitialConfigState} from "../initialize";

export const useHttp: iUseHttp = () => getInitialConfigState("useHttp")()

export default useHttp