import {ExtractPropTypes} from 'vue'
import {PlcGroupProps, PlcProps, PlcPublicAttrs} from "./plc.utils";

type PlcPropsType = Omit<ExtractPropTypes<typeof PlcProps>, 'width' | 'order'> & { width: number, order: number | undefined }
type PlcStateType = { [k in keyof PlcPropsType]: PlcPropsType[k] | null }

type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcGroupProps>, 'order'> & { order: number | undefined }
type PlcGroupStateType = { [k in keyof PlcGroupPropsType]: PlcGroupPropsType[k] | null }

export type PlcGroup = typeof PlcPublicAttrs & {
    group: true,
    children: TablePlc[],
    props: PlcGroupPropsType,
    state: PlcGroupStateType,
    refer: () => PlcGroup,
}

export type Plc = typeof PlcPublicAttrs & {
    group: false,
    props: PlcPropsType,
    state: PlcStateType,
    refer: () => Plc,
}

export type TablePlc = PlcGroup | Plc