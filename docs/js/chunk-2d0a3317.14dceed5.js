(window["webpackJsonp_main-application-project"]=window["webpackJsonp_main-application-project"]||[]).push([["chunk-2d0a3317"],{"00ab":function(t,e,n){"use strict";n.r(e);var i=n("7a23"),l={class:"dialog-service"};function o(t,e,n,o,c,r){var u=Object(i["B"])("pl-button"),a=Object(i["B"])("demo-row");return Object(i["w"])(),Object(i["g"])("div",l,[Object(i["k"])(a,{title:"基本用法"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"基本用法",onClick:e[1]||(e[1]=function(e){return t.$dialog("操作成功")})})]})),_:1}),Object(i["k"])(a,{title:"提示状态"},{default:Object(i["J"])((function(){return[(Object(i["w"])(),Object(i["g"])(i["a"],null,Object(i["A"])(["primary","success","warn","error","info"],(function(e){return Object(i["k"])(u,{label:e,status:e,onClick:function(n){return t.$dialog[e]("操作进行中")},key:e},null,8,["label","status","onClick"])})),64))]})),_:1}),Object(i["k"])(a,{title:"确认对话框"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"基本用法",onClick:r.confirm},null,8,["onClick"])]})),_:1}),Object(i["k"])(a,{title:"去掉 状态 图标"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"基本用法",onClick:e[2]||(e[2]=function(e){return t.$dialog("操作成功",{status:null})})})]})),_:1}),Object(i["k"])(a,{title:"dialog参数，以及自定义内容"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"基本用法",onClick:r.customOption},null,8,["onClick"])]})),_:1}),Object(i["k"])(a,{title:"输入对话框"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"input",onClick:e[3]||(e[3]=function(e){t.$dialog({editType:"input",editValue:c.inputValue,onConfirm:function(e){c.inputValue=e,t.$message(String(e))},confirmButton:!0,cancelButton:!0})})}),Object(i["k"])(u,{label:"textarea",onClick:e[4]||(e[4]=function(e){t.$dialog({editType:"textarea",editValue:c.inputValue,onConfirm:function(e){c.inputValue=e,t.$message(String(e))},confirmButton:!0,cancelButton:!0})})}),Object(i["k"])(u,{label:"input readonly",onClick:e[5]||(e[5]=function(e){return t.$dialog({editType:"input",editValue:"Hello world",editReadonly:!0,onConfirm:function(e){return t.$message(String(e))},confirmButton:!0,cancelButton:!0})})}),Object(i["k"])(u,{label:"textarea readonly",onClick:e[6]||(e[6]=function(e){return t.$dialog({editType:"textarea",editValue:"Hello world",editReadonly:!0,onConfirm:function(e){return t.$message(String(e))},confirmButton:!0,cancelButton:!0})})})]})),_:1}),Object(i["k"])(a,{title:"多实例"},{default:Object(i["J"])((function(){return[Object(i["k"])(u,{label:"基本用法",onClick:e[7]||(e[7]=function(t){return r.multiService()})})]})),_:1})])}n("96cf");var c=n("1da1");function r(t){return"function"===typeof t||"[object Object]"===Object.prototype.toString.call(t)&&!Object(i["o"])(t)}var u={name:"dialog-service",props:{},data:function(){return{inputValue:"默认文本"}},methods:{customOption:function(){this.$dialog({title:"确认提示",horizontal:"end",transition:"pl-transition-dialog-right",fullHeight:!0,wrapperPadding:!1,render:function(){var t,e,n=this;return Object(i["k"])(Object(i["B"])("pl-form"),{centerWhenSingleColumn:!0},{default:function(){return[Object(i["k"])(Object(i["B"])("pl-form-item"),{label:"用户名"},r(t=Object(i["k"])(Object(i["B"])("pl-input"),{modelValue:n.userInfo.username,"onUpdate:modelValue":function(t){return n.userInfo.username=t}},null))?t:{default:function(){return[t]}}),Object(i["k"])(Object(i["B"])("pl-form-item"),{label:"旧密码"},r(e=Object(i["k"])(Object(i["B"])("pl-input"),{modelValue:n.userInfo.password,"onUpdate:modelValue":function(t){return n.userInfo.password=t},nativeAttrs:{type:"password"}},null))?e:{default:function(){return[e]}})]}})}})},multiService:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=this.$dialog({render:function(){return Object(i["k"])("div",null,["第".concat(e,"个实例"),Object(i["k"])(Object(i["B"])("pl-button"),{label:"close",onClick:function(){return n.close()},style:"margin:0 8px"},null),Object(i["k"])(Object(i["B"])("pl-button"),{label:"open another dialog",onClick:function(){return t.multiService(e+1)}},null)])}})},confirm:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$dialog.confirm("确认要删除该文件吗？");case 2:t.$message.success("删除成功！");case 3:case"end":return e.stop()}}),e)})))()}}};u.render=o;e["default"]=u}}]);
//# sourceMappingURL=chunk-2d0a3317.14dceed5.js.map