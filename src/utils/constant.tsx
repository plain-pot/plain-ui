export enum CheckboxStatus {
    uncheck = 'uncheck',
    check = 'check',
    minus = 'minus',
}

export const STATUS = {
    white: {icon: 'el-icon-info', status: 'white'},
    black: {icon: 'el-icon-info', status: 'black'},
    lite: {icon: 'el-icon-info', status: 'white'},
    dark: {icon: 'el-icon-info', status: 'black'},
    primary: {icon: 'el-icon-info', status: 'primary'},
    success: {icon: 'el-icon-success', status: 'success'},
    warn: {icon: 'el-icon-warning', status: 'warn'},
    error: {icon: 'el-icon-error', status: 'error'},
    info: {icon: 'el-icon-info', status: 'info'},
} as { [k: string]: { icon: string, status: string } }

export const noop = () => void 0
