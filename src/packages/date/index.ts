import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlDate} from "./date";
import {PlDatePanelYear} from "./panel/date-panel-year";

export default createComponentPlugin(PlDate, {
    exposeComponents: {
        PlDatePanelYear,
    }
})