import {createServiceWithoutContext} from "../PlRoot/registryRootService";
import useMessage from "../useMessage";

export const $$message = createServiceWithoutContext(useMessage)

export default $$message