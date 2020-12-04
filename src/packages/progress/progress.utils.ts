export const PROGRESS_DEFAULT_PROPS = {
    modelValue: {type: Number, default: 100},                           // 进度百分比，双向绑定值
    outerColor: {type: String, default: '#f2f2f2'},                     // 外层未激活颜色
    innerColor: {type: String, default: '#12b4a5'},                     // 内层已经激活颜色
    speed: {type: Number, default: 3},                                  // 动画速度
    status: {type: String, default: 'normal'},                          // 状态
    successColor: {type: String, default: '#42E67F'},                   // 成功状态颜色
    errorColor: {type: String, default: '#FF6235'},                     // 失败状态颜色
}