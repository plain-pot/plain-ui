import {ExtractPropTypes} from 'vue';
import {TableProps} from "../table.utils";
import {useModel} from "../../../../use/useModel";
import {SimpleObject} from "../../../../shims";

export function useTableTree(
    {
        props,
        emit,
    }: {
        props: ExtractPropTypes<typeof TableProps>,
        emit: {
            onUpdateData: (data?: SimpleObject[]) => void,
        }
    }
) {

    const dataModel = useModel(() => props.data, emit.onUpdateData)

    return {
        dataModel,
    }

}