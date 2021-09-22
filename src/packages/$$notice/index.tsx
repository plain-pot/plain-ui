import {createServiceWithoutContext} from "../PlRoot/registryRootService";
import {useNotice} from "../useNotice";

export const $$notice = createServiceWithoutContext(useNotice)

export default $$notice