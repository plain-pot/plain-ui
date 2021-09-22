import {tTableOptionHooks} from "../use.hooks";

import {tTableOptionMethods} from "../use.methods";
import {useTableOptionSearchFilter} from "./useSearchFilter";
import {useTableOptionFormFilter} from "./useFormFilter";
import {useTableOptionColumnFilter} from "./useColumnFilter";
import {iTableProConfig, tTableOptionConfig} from "../../createUseTableOption.utils";
import {tTableOptionSort} from "../use.sort.state";
import {tTableOptionFilter} from "../use.filter.state";
import {tTableOptionSetting} from "../setting/use.setting";

export function useTableOptionFilter({hooks, methods, customConfig, sortState, filterState, setting, config}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, sortState: tTableOptionSort, filterState: tTableOptionFilter, setting: tTableOptionSetting, config: tTableOptionConfig }) {

    /**
     * 表单查询
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const formFilter = useTableOptionFormFilter({hooks, methods, filterState})

    /**
     * 搜索栏
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const searchFilter = useTableOptionSearchFilter({hooks, methods, filterState, setting, onCollapse: () => formFilter.toggle(), isCollapse: () => !formFilter.state.isShow})

    /**
     * 列筛选
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const columnFilter = useTableOptionColumnFilter({hooks, methods, customConfig, sortState, filterState, config})

    return {
        searchFilter,
        formFilter,
        columnFilter,
    }

}
