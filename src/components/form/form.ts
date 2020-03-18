export declare interface FormRule {
    trigger: FormTrigger
    required: Boolean
    min: Number
    max: Number
    regexp: RegExp | string
    message: string | Function
    validator: () => string | null
}

export enum FormTrigger {
    CHANGE = 'change',
    BLUR = 'blur',
}