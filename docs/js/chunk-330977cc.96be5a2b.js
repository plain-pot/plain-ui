(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-330977cc"],{1002:function(e,t,l){},"1e5a":function(e,t,l){"use strict";l.r(t);var n=l("7a23"),c={class:"demo-button"};function a(e,t,l,a,b,o){var r=Object(n["z"])("pl-button"),u=Object(n["z"])("demo-row"),i=Object(n["z"])("demo-line"),j=Object(n["z"])("pl-button-group");return Object(n["u"])(),Object(n["g"])("div",c,[Object(n["k"])(u,{title:"基本用法"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"基本",onClick:t[1]||(t[1]=function(e){return o.log(1)})})]})),_:1}),Object(n["k"])(u,{title:"状态"},{default:Object(n["F"])((function(){return[(Object(n["u"])(),Object(n["g"])(n["a"],null,Object(n["y"])(["primary","success","warn","error","info"],(function(e){return Object(n["k"])(r,{key:e,label:e,status:e},null,8,["label","status"])})),64))]})),_:1}),Object(n["k"])(u,{title:"模式"},{default:Object(n["F"])((function(){return[(Object(n["u"])(),Object(n["g"])(n["a"],null,Object(n["y"])(["fill","stroke","text"],(function(e){return Object(n["k"])(i,{title:e,key:e},{default:Object(n["F"])((function(){return[(Object(n["u"])(),Object(n["g"])(n["a"],null,Object(n["y"])(["primary","success","warn","error","info"],(function(t){return Object(n["k"])(r,{key:t,label:t,status:t,mode:e},null,8,["label","status","mode"])})),64))]})),_:2},1032,["title"])})),64))]})),_:1}),Object(n["k"])(u,{title:"形状"},{default:Object(n["F"])((function(){return[(Object(n["u"])(),Object(n["g"])(n["a"],null,Object(n["y"])(["fillet","round","square"],(function(e){return Object(n["k"])(r,{key:e,label:e,shape:e},null,8,["label","shape"])})),64))]})),_:1}),Object(n["k"])(u,{title:"大小"},{default:Object(n["F"])((function(){return[(Object(n["u"])(),Object(n["g"])(n["a"],null,Object(n["y"])(["large","normal","mini"],(function(e){return Object(n["k"])(r,{key:e,label:e,size:e},null,8,["label","size"])})),64))]})),_:1}),Object(n["k"])(u,{title:"图标按钮"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{icon:"el-icon-search",label:"搜索"}),Object(n["k"])(r,{icon:"el-icon-s-tools",label:"搜索",shape:"round"}),Object(n["k"])(r,{icon:"el-icon-search",shape:"round","icon-only":""}),Object(n["k"])(r,{icon:"el-icon-search","icon-only":""}),Object(n["k"])(r,{icon:"el-icon-search",mode:"stroke","icon-only":""}),Object(n["k"])(r,{icon:"el-icon-search",mode:"stroke",shape:"round","icon-only":""}),Object(n["k"])(r,{icon:"el-icon-search",mode:"text","icon-only":""})]})),_:1}),Object(n["k"])(u,{title:"块级按钮"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"按钮",block:""})]})),_:1}),Object(n["k"])(u,{title:"禁用"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"按钮",mode:"fill",disabled:"",icon:"el-icon-search"}),Object(n["k"])(r,{label:"按钮",mode:"stroke",disabled:""}),Object(n["k"])(r,{label:"按钮",mode:"text",disabled:""})]})),_:1}),Object(n["k"])(u,{title:"加载状态"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"搜索",loading:b.loadingFlag,width:"90"},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",label:"搜索",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",label:"搜索",shape:"round",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",shape:"round","icon-only":"",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search","icon-only":"",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",mode:"stroke","icon-only":"",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",mode:"stroke",shape:"round","icon-only":"",loading:b.loadingFlag},null,8,["loading"]),Object(n["k"])(r,{icon:"el-icon-search",mode:"text","icon-only":"",loading:b.loadingFlag},null,8,["loading"])]})),_:1}),Object(n["k"])(u,{title:"click节流"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"1000ms",onClick:t[2]||(t[2]=function(t){return e.$message(String(Date.now()))}),throttleClick:""}),Object(n["k"])(r,{label:"500ms",onClick:t[3]||(t[3]=function(t){return e.$message(String(Date.now()))}),throttleClick:500})]})),_:1}),Object(n["k"])(u,{title:"自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"异步任务",asyncHandler:o.asyncHandler,autoLoading:""},null,8,["asyncHandler"])]})),_:1}),Object(n["k"])(u,{title:"按钮异步文本"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:b.asyncLabel,onClick:t[4]||(t[4]=function(e){return o.log(1)})},null,8,["label"])]})),_:1}),Object(n["k"])(u,{title:"按钮组：基本用法"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,null,{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1})]})),_:1}),Object(n["k"])(u,{title:"按钮组：模式"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,{mode:"fill"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{mode:"stroke"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{mode:"text"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1})]})),_:1}),Object(n["k"])(u,{title:"按钮组：继承属性"},{default:Object(n["F"])((function(){return[Object(n["k"])(i,{title:"大小"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,{size:"large"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{size:"normal"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{size:"mini"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1})]})),_:1}),Object(n["k"])(i,{title:"形状"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,{shape:"fillet"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{shape:"round"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{shape:"none"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1})]})),_:1})]})),_:1}),Object(n["k"])(u,{title:"按钮组方向"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,{vertical:""},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{vertical:"",mode:"stroke"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1}),Object(n["k"])(j,{vertical:"",mode:"text"},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林"}),Object(n["k"])(r,{label:"山脉"}),Object(n["k"])(r,{label:"火山"})]})),_:1})]})),_:1}),Object(n["k"])(u,{title:"按钮组禁用与只读"},{default:Object(n["F"])((function(){return[Object(n["k"])(j,{disabled:""},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林",onClick:t[5]||(t[5]=function(e){return o.log("丛林")})}),Object(n["k"])(r,{label:"山脉",onClick:t[6]||(t[6]=function(e){return o.log("山脉")})}),Object(n["k"])(r,{label:"火山",onClick:t[7]||(t[7]=function(e){return o.log("火山")})})]})),_:1}),Object(n["k"])(j,{readonly:""},{default:Object(n["F"])((function(){return[Object(n["k"])(r,{label:"丛林",onClick:t[8]||(t[8]=function(e){return o.log("丛林")})}),Object(n["k"])(r,{label:"山脉",onClick:t[9]||(t[9]=function(e){return o.log("山脉")})}),Object(n["k"])(r,{label:"火山",onClick:t[10]||(t[10]=function(e){return o.log("火山")})})]})),_:1})]})),_:1})])}l("d3b7"),l("96cf");var b=l("1da1"),o={name:"demo-button",props:{},data:function(){return{asyncLabel:new Promise((function(e){return setTimeout((function(){return e("异步文本")}),2e3)})),loadingFlag:!0}},methods:{asyncHandler:function(e){var t=this;return Object(b["a"])(regeneratorRuntime.mark((function l(){return regeneratorRuntime.wrap((function(l){while(1)switch(l.prev=l.next){case 0:return t.$message("async task start"),l.next=3,t.$plain.utils.delay(3e3);case 3:if(!(Math.random()>.5)){l.next=8;break}throw t.$message.error("async task error"),new Error("异步任务出错");case 8:console.log(e),t.$message.success("async task end");case 10:case"end":return l.stop()}}),l)})))()},log:function(){var e;(e=console).log.apply(e,arguments)}}};l("6079");o.render=a;t["default"]=o},6079:function(e,t,l){"use strict";l("1002")}}]);
//# sourceMappingURL=chunk-330977cc.96be5a2b.js.map