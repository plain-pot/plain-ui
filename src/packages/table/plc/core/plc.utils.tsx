export const PlcGroupProps = {
    title: {type: String},                                                  // 列标题
    order: {type: [Number, String]},                                        // 列排序
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: '120'},                        // 列宽度
    fit: {type: Boolean},                                                   // 列宽自适应(只有一个列能够自适应)
}