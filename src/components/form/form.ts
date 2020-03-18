export declare interface FormRule {
    trigger: FormTrigger
    required: Boolean
    min: Number
    max: Number
    regexp: RegExp | string
    message: string | Function
    options: any[] | any
    validator: () => string | null
}

export enum FormTrigger {
    CHANGE = 'change',
    BLUR = 'blur',
    ALL = 'ALL',
}