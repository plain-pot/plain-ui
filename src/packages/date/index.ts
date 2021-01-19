import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlDate} from "./date";
import {PlDatePanelYear} from "./panel/date-panel-year";
import {PlDatePanelMonth} from "./panel/date-panel-month";
import {PlDatePanelDate} from "./panel/date-panel-date";
import {PlDatePanelDateRange} from "./panel/date-panel-date-range";

export default createComponentPlugin(PlDate, {
    exposeComponents: {
        PlDatePanelYear,
        PlDatePanelMonth,
        PlDatePanelDate,
        PlDatePanelDateRange,
    }
})