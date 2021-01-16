import Plc from '../table/plc/core/plc'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import PlcInput from "../table/plc/edit/plc-input";
import PlcNumber from "../table/plc/edit/plc-number";
import PlcDate from "../table/plc/edit/plc-date";
import PlcColorPicker from "../table/plc/edit/plc-color-picker";
import PlcToggle from "../table/plc/edit/plc-toggle";
import PlcRate from "../table/plc/edit/plc-rate";
import PlcIndex from "../table/plc/standard/plc-index";
import PlcExpand from "../table/plc/standard/plc-expand";
import PlcCheck from "../table/plc/standard/plc-check";
import PlcDraggier from "../table/plc/standard/draggier/plc-draggier";
import PlcTree from "../table/plc/standard/tree/plc-tree";

export default createComponentPlugin(Plc, {
    exposeComponents: {
        /*---------------------------------------standard-------------------------------------------*/
        PlcIndex,
        PlcExpand,
        PlcCheck,
        PlcDraggier,
        PlcTree,
        /*---------------------------------------edit-------------------------------------------*/
        PlcInput,
        PlcNumber,
        PlcDate,
        PlcColorPicker,
        PlcToggle,
        PlcRate,
    },
})