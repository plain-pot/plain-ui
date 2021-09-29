import {VueNode} from "plain-ui-composition";

export interface iTableOptionSettingConfig {
    key: eTableOptionSettingView,
    title: string,
    seq: number,
    render: () => VueNode,
    beforeOpen?: () => void | Promise<void>,
    contentPending?: boolean,
}

export interface iTableOptionSettingInnerUser {
    (config: iTableOptionSettingConfig): void
}

export enum eTableOptionSettingView {
    seniorFilter = 'seniorFilter',
    allFilter = 'allFilter',
    sort = 'sort',
    config = 'config',
    cache = 'cache',
    import = 'import',
    export = 'export',
}
