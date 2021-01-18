import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlDate} from "./date";
import {PlDatePanelYear} from "./panel/date-panel-year";
import {PlDatePanelMonth} from "./panel/date-panel-month";

export default createComponentPlugin(PlDate, {
    exposeComponents: {
        PlDatePanelYear,
        PlDatePanelMonth,
    }
})