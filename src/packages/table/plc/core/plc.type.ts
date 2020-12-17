export type PlcGroup = {
    group: true,
    children: TablePlc[]
}

export type Plc = {
    group: false,
}

export type TablePlc = PlcGroup | Plc