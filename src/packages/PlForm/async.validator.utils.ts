import {RuleType, ValidateOption, ValidateSource} from "async-validator";

export interface iRules {
    [field: string]: iRuleItem | iRuleItem[];
}

export interface iRuleItem {
    type?: RuleType; // default type is 'string'
    required?: boolean;
    pattern?: any;
    min?: number; // Range of type 'string' and 'array'
    max?: number; // Range of type 'string' and 'array'
    len?: number; // Length of type 'string' and 'array'
    enum?: Array<string | number | boolean | null | undefined>; // possible values of type 'enum'
    whitespace?: boolean;
    fields?: iRules; // ignore when without required
    options?: ValidateOption;
    defaultField?: iRuleItem; // 'object' or 'array' containing validation rules
    transform?: (value: any, source: any) => any;
    message?: string | (() => string);
    asyncValidator?: (
        rule: iRules,
        value: any,
        callback: (error: string | string[] | void) => void,
        source: ValidateSource,
        options: ValidateOption,
    ) => void | Promise<void>;
    validator?: (
        rule: iRules,
        value: any,
        callback: (error: string | string[] | void) => void,
        source: ValidateSource,
        options: ValidateOption,
    ) => boolean | Error | Error[];
}
