(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-2d20ed94"],{b0b2:function(a,l,e){"use strict";e.r(l);var t=function(){var a=this,l=a.$createElement,e=a._self._c||l;return e("div",{staticClass:"demo-select"},[e("demo-row",{attrs:{title:"基本用法"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val"},model:{value:a.val[0],callback:function(l){a.$set(a.val,0,l)},expression:"val[0]"}}),e("span",[a._v(a._s(a.val[0]))])],1),e("demo-row",{attrs:{title:"自定义内容"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val"},scopedSlots:a._u([{key:"default",fn:function(l){var t=l.data;return[e("div",[e("span",[a._v(a._s(t.name))]),e("span",{staticStyle:{float:"right","font-size":"12px",color:"#ccc"}},[a._v(a._s(t.val))])])]}}]),model:{value:a.val[1],callback:function(l){a.$set(a.val,1,l)},expression:"val[1]"}}),e("span",[a._v(a._s(a.val[1]))])],1),e("demo-row",{attrs:{title:"加载状态"}},[e("pl-checkbox",{model:{value:a.flag.loading,callback:function(l){a.$set(a.flag,"loading",l)},expression:"flag.loading"}}),e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",loading:a.flag.loading},model:{value:a.val[1],callback:function(l){a.$set(a.val,1,l)},expression:"val[1]"}}),e("span",[a._v(a._s(a.val[1]))])],1),e("demo-row",{attrs:{title:"filterable:false，禁用可输入筛选"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",filterable:!1},model:{value:a.val[2],callback:function(l){a.$set(a.val,2,l)},expression:"val[2]"}}),e("span",[a._v(a._s(a.val[2]))])],1),e("demo-row",{attrs:{title:"filterMethod，自定义输入筛选逻辑，支持中文以及拼音"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",filterMethod:a.customFilterMethod},scopedSlots:a._u([{key:"default",fn:function(l){var t=l.data;return[e("div",[e("span",[a._v(a._s(t.name))]),e("span",{staticStyle:{float:"right","font-size":"12px",color:"#ccc"}},[a._v(a._s(t.val))])])]}}]),model:{value:a.val[3],callback:function(l){a.$set(a.val,3,l)},expression:"val[3]"}}),e("span",[a._v(a._s(a.val[3]))])],1),e("demo-row",{attrs:{title:"noMatchText，输入筛选时，没有匹配项显示的文本"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",noMatchText:"没有数据啦"},model:{value:a.val[4],callback:function(l){a.$set(a.val,4,l)},expression:"val[4]"}}),e("span",[a._v(a._s(a.val[4]))])],1),e("demo-row",{attrs:{title:"noDataText，data为空时显示的文本"}},[e("pl-select",{attrs:{data:[],labelKey:"name",valueKey:"val"},model:{value:a.val[5],callback:function(l){a.$set(a.val,5,l)},expression:"val[5]"}}),e("pl-select",{attrs:{data:[],labelKey:"name",valueKey:"val",noDataText:"没有数据啦"},model:{value:a.val[5],callback:function(l){a.$set(a.val,5,l)},expression:"val[5]"}}),e("span",[a._v(a._s(a.val[5]))])],1),e("demo-row",{attrs:{title:"派发blur事件"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val"},on:{blur:function(l){a.$plain.log("blur",Date.now())},focus:function(l){a.$plain.log("focus",Date.now())}}}),e("ol",[e("li",[a._v("select关闭的时候使用tab触发blur")]),e("li",[a._v("select打开的时候使用tab触发blur")]),e("li",[a._v("select关闭的时候点击其他地方导致触发blur")]),e("li",[a._v("select打开的时候点击其他地方导致触发blur")]),e("li",[a._v("问题：怎么区分是点击select-item失去的焦点，还是点击外部区域失去的焦点 (已解决)")])])],1),e("demo-row",{attrs:{title:"禁用以及只读"}},[e("demo-line",{attrs:{title:"禁用"}},[e("pl-checkbox",{attrs:{label:"禁用"},model:{value:a.flag.disabled,callback:function(l){a.$set(a.flag,"disabled",l)},expression:"flag.disabled"}}),e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",disabled:a.flag.disabled}})],1),e("demo-line",{attrs:{title:"只读"}},[e("pl-checkbox",{attrs:{label:"只读"},model:{value:a.flag.readonly,callback:function(l){a.$set(a.flag,"readonly",l)},expression:"flag.readonly"}}),e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",readonly:a.flag.readonly}})],1)],1),e("demo-row",{attrs:{title:"多选"}},[e("pl-select",{attrs:{multiple:"",data:a.list,labelKey:"name",valueKey:"val"},model:{value:a.val[6],callback:function(l){a.$set(a.val,6,l)},expression:"val[6]"}}),e("span",[a._v(a._s(a.val[6]))])],1),e("demo-row",{attrs:{title:"multipleLimit:3，最多可以选择3个元素"}},[e("pl-select",{attrs:{data:a.list,labelKey:"name",valueKey:"val",multipleLimit:3,multiple:""},model:{value:a.val[7],callback:function(l){a.$set(a.val,7,l)},expression:"val[7]"}}),e("span",[a._v(a._s(a.val[7]))])],1)],1)},s=[],n=(e("7f7f"),{name:"demo-select",data:function(){return{val:{0:"WanSheng",1:"ErTong",6:["WanSheng","GuoQing","ZhongQiu"]},list:[{name:"春节",val:"Chun"},{name:"万圣节",val:"WanSheng"},{name:"青年节",val:"QinNian"},{name:"中年节",val:"ZhongNian"},{name:"国庆节",val:"GuoQing"},{name:"中秋节",val:"ZhongQiu"},{name:"劳动节",val:"LaoDong"},{name:"圣诞节",val:"ShengDan"},{name:"儿童节",val:"ErTong"},{name:"妇女节",val:"FuNv"},{name:"教师节",val:"JiaoShi"},{name:"清明节",val:"QingMing"}],flag:{disabled:!0,readonly:!0,loading:!0}}},methods:{customFilterMethod:function(a,l,e){var t=l.data,s=t.name,n=t.val;return(s.toLowerCase()+n.toLowerCase()).indexOf(a.toLowerCase())>-1}}}),o=n,i=e("2877"),v=Object(i["a"])(o,t,s,!1,null,null,null);l["default"]=v.exports}}]);
//# sourceMappingURL=chunk-2d20ed94.ba043f82.js.map