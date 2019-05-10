const CascadeMixin = {
    props: {
        data: {default: () => []},                                              //显示的数据
        labelKey: {type: String, required: true},                               //显示文本的key
        childrenKey: {type: String, required: true},                            //子数据key
        valueKey: {type: String, required: true},                               //节点唯一标识的key
        disabledKey: {type: String},                                            //节点是否禁用key
        cascadeWidth: {type: Number, default: 100},                             //每列级联选择的宽度

        showAllLevels: {type: Boolean, default: true},                          //显示所有选中的文本，false的话，只会显示最后一级的文本
        changeOnSelect: {type: Boolean,},                                       //在选中的时候就改变值，默认是选中最后一级的时候才改变值
        loadDataFunc: {type: Function},                                         //当没有子数据以及存在该属性时

        /*cascade不能配置的属性*/
        current: {},
        scopeSlot: {},
    }
}

export {
    CascadeMixin
}