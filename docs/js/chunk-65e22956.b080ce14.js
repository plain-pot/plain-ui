(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-65e22956"],{"0a0f":function(t,e,n){"use strict";n.r(e);var l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"demo-input"},[n("demo-row",{attrs:{title:"基本用法"}},[n("pl-input",{attrs:{clearIcon:""},model:{value:t.val[0],callback:function(e){t.$set(t.val,0,e)},expression:"val[0]"}}),n("pl-input",{attrs:{clearIcon:"",suffixIcon:"el-icon-edit-outline"},model:{value:t.val[0],callback:function(e){t.$set(t.val,0,e)},expression:"val[0]"}}),n("span",[t._v(t._s(t.val[0]))])],1),n("demo-row",{attrs:{title:"前后图标"}},[n("demo-line",{attrs:{title:"前置图标"}},[n("pl-input",{attrs:{prefixIcon:"el-icon-search",disabled:""},on:{"click-prefix-icon":function(e){return t.log("click-prefix-icon")}}})],1),n("demo-line",{attrs:{title:"后置图标"}},[n("pl-input",{attrs:{suffixIcon:"el-icon-full-screen",readonly:""},on:{"click-suffix-icon":function(e){return t.log("click-suffix-icon")}}})],1),n("demo-line",{attrs:{title:"前后置图标"}},[n("pl-input",{attrs:{suffixIcon:"el-icon-search",prefixIcon:"el-icon-full-screen"},on:{"click-prefix-icon":function(e){return t.log("click-prefix-icon")},"click-suffix-icon":function(e){return t.log("click-suffix-icon")}}})],1)],1),n("demo-row",{attrs:{title:"enter按键事件节流"}},[n("pl-input",{attrs:{placeholder:"1000ms",throttleEnter:""},on:{enter:function(e){t.$message(String(Date.now()))}}}),n("pl-input",{attrs:{placeholder:"500ms",throttleEnter:500},on:{enter:function(e){t.$message(String(Date.now()))}}})],1),n("demo-row",{attrs:{title:"自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)"}},[n("pl-input",{attrs:{placeholder:"异步任务",autoLoading:"",suffixIcon:"el-icon-view",clearIcon:""},on:{enter:t.asyncHandler}})],1),n("demo-row",{attrs:{title:"禁用"}},[n("pl-checkbox",{attrs:{label:"disabledFlag"},model:{value:t.disabledFlag,callback:function(e){t.disabledFlag=e},expression:"disabledFlag"}}),n("pl-input",{attrs:{disabled:t.disabledFlag}}),n("pl-input",{attrs:{disabled:t.disabledFlag,suffixIcon:"el-icon-search"}}),n("pl-input",{attrs:{disabled:t.disabledFlag,textarea:""}})],1),n("demo-row",{attrs:{title:"状态"}},[n("demo-line",{attrs:{title:"input"}},t._l(t.status,(function(t){return n("pl-input",{key:t,attrs:{status:t}})})),1),n("demo-line",{attrs:{title:"textarea"}},t._l(t.status,(function(t){return n("pl-input",{key:t,attrs:{status:t,textarea:""}})})),1)],1),n("demo-row",{attrs:{title:"清除图标"}},[n("demo-line",{attrs:{title:"基本用法"}},[n("pl-input",{attrs:{clearIcon:""},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")}}})],1),n("demo-line",{attrs:{title:"自定义清除逻辑"}},[n("pl-input",{attrs:{clearIcon:"",clearHandler:t.clearHandler},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")}}})],1),n("demo-line",{attrs:{title:"带前置图标"}},[n("pl-input",{attrs:{prefixIcon:"el-icon-search",clearIcon:""},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")},"click-prefix-icon":function(e){return t.log("click-prefix-icon")}}})],1),n("demo-line",{attrs:{title:"带前后置图标"}},[n("pl-input",{attrs:{suffixIcon:"el-icon-arrow-down",prefixIcon:"el-icon-search",clearIcon:""},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")},"click-prefix-icon":function(e){return t.log("click-prefix-icon")},"click-suffix-icon":function(e){return t.log("click-suffix-icon")}}})],1)],1),n("demo-row",{attrs:{title:"加载状态"}},[n("demo-line",{attrs:{title:"loading"}},[n("pl-input",{attrs:{clearIcon:"",suffixIcon:"el-icon-full-screen",loading:""},model:{value:t.val[0],callback:function(e){t.$set(t.val,0,e)},expression:"val[0]"}})],1),n("demo-line",{attrs:{title:"normal"}},[n("pl-input",{attrs:{clearIcon:"",suffixIcon:"el-icon-full-screen"},model:{value:t.val[0],callback:function(e){t.$set(t.val,0,e)},expression:"val[0]"}})],1),n("span",[t._v(t._s(t.val[0]))])],1),n("demo-row",{attrs:{title:"块级元素"}},[n("pl-input",{staticStyle:{"margin-bottom":"12px"},attrs:{block:""}}),n("pl-input",{attrs:{block:"",textarea:""}})],1),n("demo-row",{attrs:{title:"设置宽度(顺便测试 异步 props以及 函数 props)"}},[n("demo-line",{attrs:{title:"number:300"}},[n("pl-input",{attrs:{width:300}})],1),n("demo-line",{attrs:{title:"string:300"}},[n("pl-input",{attrs:{width:"300"}})],1),n("demo-line",{attrs:{title:"string:300px"}},[n("pl-input",{attrs:{width:"300px"}})],1),n("demo-line",{attrs:{title:"function:300px"}},[n("pl-input",{attrs:{width:t.functionWidth}})],1),n("demo-line",{attrs:{title:"promise:300px"}},[n("pl-input",{attrs:{width:t.asyncWidth}})],1)],1),n("demo-row",{attrs:{title:"输入框组"}},[n("demo-line",[n("pl-checkbox",{attrs:{label:"show prepend"},model:{value:t.prepend,callback:function(e){t.prepend=e},expression:"prepend"}}),n("pl-checkbox",{attrs:{label:"show append"},model:{value:t.append,callback:function(e){t.append=e},expression:"append"}})],1),n("pl-input",{attrs:{prefixIcon:"el-icon-search",suffixIcon:"el-icon-search",clearIcon:""},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")},"click-prefix-icon":function(e){return t.log("click-prefix-icon")}}},[t.prepend?n("div",{staticStyle:{width:"75px","text-align":"right"},attrs:{slot:"prepend"},slot:"prepend"},[n("pl-dropdown",[n("span",[t._v(t._s(t.val[3])+":// "),n("pl-icon",{staticClass:"el-icon-arrow-down"})],1),n("pl-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},t._l(["ftp","http","https","ssh"],(function(e){return n("pl-dropdown-item",{key:e,attrs:{label:e+"://"},on:{click:function(n){t.val[3]=e}}})})),1)],1)],1):t._e(),t.append?n("div",{attrs:{slot:"append"},slot:"append"},[t._v("append content")]):t._e()]),n("pl-input",{attrs:{prefixIcon:"el-icon-search",suffixIcon:"el-icon-search",clearIcon:""},on:{"click-clear-icon":function(e){return t.log("click-clear-icon")},"click-prefix-icon":function(e){return t.log("click-prefix-icon")}}},[t.prepend?n("pl-select",{attrs:{slot:"prepend",data:["ftp","http","https","ssh"],inputProps:{width:100}},slot:"prepend",model:{value:t.val[3],callback:function(e){t.$set(t.val,3,e)},expression:"val[3]"}}):t._e(),t.append?n("div",{attrs:{slot:"append"},slot:"append"},[t._v("append content")]):t._e()],1)],1),n("demo-row",{attrs:{title:"自定义内容"}},[n("pl-input",{attrs:{suffixIcon:"el-icon-search"}},[n("span",[t._v("自定义内容")])])],1),n("demo-row",{attrs:{title:"大小"}},[n("pl-input",{attrs:{size:"large"}}),n("pl-input"),n("pl-input",{attrs:{size:"mini"}})],1),n("demo-row",{attrs:{title:"形状"}},[n("pl-input",{attrs:{shape:"fillet"}}),n("pl-input",{attrs:{shape:"round"}}),n("pl-input",{attrs:{shape:"none"}})],1),n("demo-row",{attrs:{title:"文本域输入框"}},[n("pl-input",{attrs:{textarea:""}})],1),n("demo-row",{attrs:{title:"文本域输入框：自适应高度"}},[n("demo-line",{attrs:{title:"基本用法"}},[n("pl-input",{attrs:{textarea:"",autoHeight:"",width:300},model:{value:t.val[2],callback:function(e){t.$set(t.val,2,e)},expression:"val[2]"}})],1),n("demo-line",{attrs:{title:"去掉最大高度"}},[n("pl-input",{attrs:{textarea:"",autoHeight:"",width:300,maxHeight:null},model:{value:t.val[2],callback:function(e){t.$set(t.val,2,e)},expression:"val[2]"}})],1)],1),n("demo-row",{attrs:{title:"密码框"}},[n("pl-input",{attrs:{suffixIcon:t.passwordVisible?"el-icon-lock":"el-icon-unlock",nativeProps:{type:t.passwordVisible?"text":"password"}},on:{"click-suffix-icon":function(e){t.passwordVisible=!t.passwordVisible}}})],1),n("demo-row",{attrs:{title:"禁用以及只读"}},[t._v("\n        "+t._s(t.flag)+"\n        "),n("demo-line",{attrs:{title:"禁用"}},[n("pl-checkbox",{model:{value:t.flag.disabled,callback:function(e){t.$set(t.flag,"disabled",e)},expression:"flag.disabled"}}),n("pl-input",{attrs:{disabled:t.flag.disabled}})],1),n("demo-line",{attrs:{title:"只读"}},[n("pl-checkbox",{model:{value:t.flag.readonly,callback:function(e){t.$set(t.flag,"readonly",e)},expression:"flag.readonly"}}),n("pl-input",{attrs:{readonly:t.flag.readonly}}),n("input",{attrs:{type:"text",readonly:t.flag.readonly}})],1)],1)],1)},i=[],a=(n("96cf"),n("3b8d")),o=n("e229"),r={name:"demo-input",mixins:[o["a"]],props:{},data:function(){return{val:{3:"https"},prepend:!0,append:!0,disabledFlag:!0,passwordVisible:!1,flag:{disabled:!0,readonly:!0},clearHandler:function(t){console.log("clearHandler")},asyncWidth:new Promise((function(t){return setTimeout((function(){return t("300px")}),2e3)})),functionWidth:function(){return"300px"}}},methods:{log:function(t){console.log(t)},asyncHandler:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.$message("async task start"),t.next=3,this.$plain.utils.delay(3e3);case 3:if(!(Math.random()>.5)){t.next=8;break}throw this.$message.error("async task error"),new Error("异步任务出错");case 8:console.log(e),this.$message.success("async task end");case 10:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()}},c=r,s=n("2877"),p=Object(s["a"])(c,l,i,!1,null,null,null);e["default"]=p.exports},e229:function(t,e,n){"use strict";var l={data:function(){return{status:["primary","success","warn","error","info"],shapes:["fillet","round","square"],sizes:["mini","normal","large"],aligns:["left","center","right"],val:{}}},methods:{log:function(){var t;(t=console).log.apply(t,arguments)}}};e["a"]=l}}]);
//# sourceMappingURL=chunk-65e22956.b080ce14.js.map