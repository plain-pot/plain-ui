import {tUseTableOption} from "../createUseTableOption";
import {getInitialConfigState} from "../initialize";

const useTableOption: tUseTableOption = (config) => getInitialConfigState('useTableOption')(config)

export default useTableOption