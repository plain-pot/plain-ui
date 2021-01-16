import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlDate} from "./date";
import {PlDatePanel} from "./panel/date-panel";
import {PlDateBasePanelDate} from "./panel/date-base-panel-date";
import {PlDateBasePanelMonth} from "./panel/date-base-panel-month";
import {PlDateBasePanelYear} from "./panel/date-base-panel-year";
import {PlDatePanelDateRange} from "./panel/date-panel-date-range";
import {PlDatePanelDates} from "./panel/date-panel-dates";
import {PlDatePanelWeek} from "./panel/date-panel.week";

export default createComponentPlugin(PlDate, {
    exposeComponents: {
        PlDatePanel,
        PlDateBasePanelDate,
        PlDateBasePanelMonth,
        PlDateBasePanelYear,
        PlDatePanelDateRange,
        PlDatePanelDates,
        PlDatePanelWeek,
    }
})