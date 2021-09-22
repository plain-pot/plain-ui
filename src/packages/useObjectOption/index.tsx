import {tUseTableOption} from "../createUseTableOption";
import {getInitialConfigState} from "../initialize";

const useObjectOption: tUseTableOption = (config) => getInitialConfigState('useObjectOption')(config)

export default useObjectOption