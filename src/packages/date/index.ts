import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlDate} from "./date";
import {PlDatePanelYear} from "./panel/date-panel-year";
import {PlDatePanelMonth} from "./panel/date-panel-month";
import {PlDatePanelDate} from "./panel/date-panel-date";
import {PlDatePanelRange} from "./panel/date-panel-range";
import {PlDatePanelWeek} from "./panel/date-panel-week";
import {PlDatePanelQuarter} from "./panel/date-panel-quarter";

export default createComponentPlugin(PlDate, {
    exposeComponents: {
        PlDatePanelYear,
        PlDatePanelMonth,
        PlDatePanelDate,
        PlDatePanelRange,
        PlDatePanelWeek,
        PlDatePanelQuarter,
    }
})