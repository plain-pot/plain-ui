import {StyleStatus} from "../use/useStyle";

export enum CheckboxStatus {
    uncheck = 'uncheck',
    check = 'check',
    minus = 'minus',
}

export const DEFAULT_STATUS = StyleStatus.primary

export const STATUS = {
    white: {icon: 'el-icon-info', status: 'white'},
    black: {icon: 'el-icon-info', status: 'black'},
    primary: {icon: 'el-icon-info', status: 'primary'},
    success: {icon: 'el-icon-success', status: 'success'},
    warn: {icon: 'el-icon-warning', status: 'warn'},
    error: {icon: 'el-icon-error', status: 'error'},
    info: {icon: 'el-icon-question', status: 'info'},
} as { [k: string]: { icon: string, status: string } }