import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {usePlc} from "./plc";

export function designPlc(
    {
        name
    }: {
        name: string,
    }
) {
    return designComponent({
        name,
        props: {
            ...PlcProps,
        },
        setup({props}) {
            return usePlc(props)
        },
    })
}