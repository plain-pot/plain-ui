export const FORM_COLLECTOR = '@@FORM_COLLECTOR'
export const FORM_PROVIDER = '@@FORM_PROVIDER'

export const FormUtils = {
    getValueByField(field: string, formData: any) {
        if (!formData) {
            return undefined
        }
        const fields = field.split('.')
        let index = 0, len = fields.length
        let value = formData[fields[index]]

        while (index < len - 1 && value != null) {
            value = value[fields[++index]]
        }

        return index == len - 1 ? value : undefined
    },
};

(window as any).FormUtils = FormUtils