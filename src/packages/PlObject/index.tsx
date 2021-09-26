import {designComponent, PropType} from "plain-ui-composition";
import {tTableOption} from "../createUseTableOption";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import PlInput from "../PlInput";

import useObject from "../useObject";
import {PlainObject} from "plain-utils/utils/event";

export const PlObjectPropsOption = {
    option: {type: Object as PropType<tTableOption>},
    row: {type: Object as PropType<PlainObject>},
    map: {type: Object as PropType<Record<string, string> | ((source: PlainObject, selected: PlainObject) => void)>},
    showKey: {type: String},
    beforeSelect: {type: Function as PropType<(row: PlainObject) => void | Promise<void>>},
    afterSelect: {type: Function as PropType<(source: PlainObject, selected: PlainObject) => void | Promise<void>>},
}

export const PlObject = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,
        ...PlObjectPropsOption,
    },
    setup({props}) {

        useStyle()
        const {editComputed} = useEdit()
        const {$object} = useObject()

        const open = async () => {

            if (!props.option) {
                throw new Error('PlObject: props.option is necessary!')
            }
            !!props.beforeSelect && await props.beforeSelect(props.row!)
            const selected = await $object({
                option: props.option,
                readonly: !editComputed.value.editable,
                selected: !props.row || !props.map || typeof props.map !== "object" ? undefined : Object.entries(props.map).reduce((prev, [sourceKey, selectedKey]) => {
                    prev[selectedKey] = props.row![sourceKey]
                    return prev
                }, {} as Record<string, any>)
            })

            if (!!props.map) {
                if (typeof props.map === "function") {
                    await props.map(props.row!, selected)
                } else {
                    Object.entries(props.map).forEach(([sourceKey, selectKey]) => {
                        props.row![sourceKey] = selected[selectKey]
                    })
                }
            }

            !!props.afterSelect && await props.afterSelect(props.row!, selected)
        }

        return () => (
            <PlInput
                modelValue={!props.row || !props.showKey ? null : props.row[props.showKey]}
                inputReadonly
                suffixIcon="el-icon-search"
                onClickInput={open}
            />
        )

    },
})

export default PlObject
