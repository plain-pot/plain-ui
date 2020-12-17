export type PlcGroup = {
    group: true,
}

export type Plc = {
    group: false,
}

export type TablePlc = PlcGroup | Plc