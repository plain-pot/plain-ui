import {computed, ExtractPropTypes, onBeforeUnmount, reactive, useRefs, VueNode, watch} from "plain-ui-composition";
import {TableProps} from "../../table/utils/table.utils";
import {formatPlcList, tPlcData} from "./formatPlcList";
import PlcGroup from "../core/PlcGroup";
import {tTableHooks} from "../../table/use/useTableHooks";
import {tPlc, tPlcType} from "../utils/plc.type";
import {runOnce} from "./utils/runOnce";
import PlDialog from "../../../PlDialog";

/**
 * 负责监听根group，收集plcTypeArr
 * @author  韦胜健
 * @date    2021/6/1 16:10
 */
export function usePlcList({props, slots, hooks, onCollectPlcData}: {
    props: ExtractPropTypes<typeof TableProps>,
    slots: { default: () => VueNode },
    hooks: tTableHooks,
    onCollectPlcData: (data: tPlcData) => void,
}) {

    const {refs, onRef} = useRefs({group: PlcGroup})
    const renderCollector = () => <PlcGroup ref={onRef.group}>{slots.default()}</PlcGroup>

    /*---------------------------------------state-------------------------------------------*/

    const state = reactive({
        tableWidth: null as null | number,
        getTableEl: null as null | (() => HTMLDivElement),
        getPlcTypeArr: null as null | (() => tPlcType[]),
    });

    hooks.onPlcTypes.use(list => {state.getPlcTypeArr = () => list});

    (() => {

        const dialog = PlDialog.use.inject(null)
        if (!!dialog) {
            const onDialogOpen = () => {
                if (!!state.getTableEl) {
                    state.tableWidth = state.getTableEl().offsetWidth
                }
            }
            dialog.event.on.onOpen(onDialogOpen)
            onBeforeUnmount(() => dialog.event.off.onOpen(onDialogOpen))
        }

        /*table 挂载的时候保存table的宽度*/
        const ejectTableMounted = hooks.onTableMounted.use(el => {
            state.tableWidth = el.offsetWidth
            state.getTableEl = () => el
        })

        const onWindowResize = () => {state.tableWidth = state.getTableEl!().offsetWidth}
        window.addEventListener('resize', onWindowResize)

        const unWatch = watch(() => !refs.group ? null : refs.group.children, list => {hooks.onPlcTypes.exec(list || [])})

        onBeforeUnmount(() => {
            ejectTableMounted()
            window.removeEventListener('resize', onWindowResize)
            unWatch()
        })
    })();

    /*---------------------------------------computed-------------------------------------------*/

    const runConfig = runOnce((plcList: tPlcType[], flatList: tPlc[]) => {!!props.config && props.config(plcList, flatList)})

    const plcData = computed(() => {
        if (!state.tableWidth || !state.getPlcTypeArr) {return null}
        const plcData = formatPlcList({
            plcList: state.getPlcTypeArr(),
            tableWidth: state.tableWidth,
            configPlcTypes: runConfig,
        })
        onCollectPlcData(plcData)
        return plcData
    })

    return {
        plcData,
        renderCollector,
    }
}
