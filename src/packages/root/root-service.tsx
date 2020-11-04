export interface RootServiceRefer {
    isShow: { value: boolean },
    isOpen: { value: boolean },
    show: (option: any) => void | Promise<void>,
}