export interface NoticeServiceOption {
    id: string,

    message: string,
    time: number,
    noClose: boolean,
    render: Function,
    status: string,
    onClick: Function,
    vertical: string,
    horizontal: string,
}