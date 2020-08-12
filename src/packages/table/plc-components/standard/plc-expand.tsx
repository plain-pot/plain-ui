import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {$plain} from "@/packages/base";
import {inject} from "@vue/composition-api";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";

export default definePlc({
    name: 'plc-expand',
    props: {
        // custom
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9997},
        width: {default: 60},
        align: {default: 'center'},
        notFitVirtual: {type: Boolean, default: true},

        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                return '展开'
            }
        },
        default: {
            type: Function,
            default: function (tableRenderData: TableRenderData) {
                const plcInstance = tableRenderData.plc.ctx as any
                return (
                    <pl-button icon="el-icon-arrow-down" mode="text" onClick={e => plcInstance.expandPlc.toggle(tableRenderData, e)}/>
                )
            }
        },
    },
    setup() {

        const table = inject(TABLE_PROVIDER) as PlainTable

        const expandPlc = {
            toggle: (renderData: TableRenderData, e: MouseEvent) => {
                expandPlc.expand(renderData, e)
            },
            expand: (renderData: TableRenderData, e: MouseEvent) => {
                let target = e.target as HTMLElement
                while (!$plain.utils.hasClass(target, 'plt-row')) {
                    target = target.parentNode as HTMLElement
                }
                const vid = target.getAttribute('vid')
                const bodyCenterEl = table.refs.$el.querySelector('.plt-body-item.pl-table-item-fixed-center')
                if (!bodyCenterEl) {
                    console.error('内部错误，无法找到center table body！');
                    return
                }
                const rowCenterEl = bodyCenterEl.querySelector(`[vid="${vid}"]`)
                if (!rowCenterEl) {
                    console.error('内部错误，无法找到center row center！');
                    return;
                }

                console.log(rowCenterEl)
            }
        }

        return {
            expandPlc,
        }
    },
})