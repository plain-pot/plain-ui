(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39874545"],{"1d50":function(t,p,e){},"486d":function(t,p,e){"use strict";var o=e("1d50"),r=e.n(o);r.a},"48d7":function(t,p,e){"use strict";e("6c7b");var o={data:function(){var t=new Array(50).fill(null).reduce((function(t,p,e){return t[e]=null,t}),{});return{status:["primary","success","warn","error","info"],shapes:["fillet","round","square"],sizes:["mini","normal","large"],aligns:["left","center","right"],val:t}},methods:{log:function(){var t;(t=console).log.apply(t,arguments)}}};p["a"]=o},"50e4":function(t,p,e){"use strict";e.r(p);var o=function(){var t=this,p=t.$createElement,e=t._self._c||p;return e("div",{staticClass:"demo-popper"},[e("demo-row",{attrs:{title:"基本用法"}},[e("pl-popper",{attrs:{width:null,height:null}},[e("pl-button",{attrs:{label:"hover激活"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1)],1),e("demo-row",{staticClass:"demo-popper-placement",attrs:{title:"位置"}},t._l(t.directions,(function(p){return e("demo-line",{key:p},[e("pl-popper",{key:p+"-1",attrs:{placement:p}},[e("pl-button",{attrs:{label:p}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                    这里是popper的内容\n                ")])],1),t._l(t.aligns,(function(o){return e("pl-popper",{key:o,attrs:{placement:p+"-"+o}},[e("pl-button",{attrs:{label:p+"-"+o}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                    这里是popper的内容\n                ")])],1)}))],2)})),1),e("demo-row",{attrs:{title:"触发动作"}},[e("pl-popper",{attrs:{trigger:"hover"}},[e("pl-button",{attrs:{label:"hover激活"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{trigger:"click"}},[e("pl-button",{attrs:{label:"click激活"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{trigger:"manual"},model:{value:t.val[1],callback:function(p){t.$set(t.val,1,p)},expression:"val[1]"}},[e("pl-button",{attrs:{label:"manual激活"},on:{click:function(p){return t.$set(t.val,1,!t.val[1])}}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容"+t._s(t.val[1])+"\n            ")])],1),e("pl-popper",{attrs:{trigger:"focus"}},[e("pl-button",{attrs:{label:"focus激活"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{trigger:"focus"}},[e("span",[t._v("focus激活")]),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])])],1),e("demo-row",{attrs:{title:"测试组件销毁之后，监听的事件是否已经销毁"}},[e("pl-checkbox",{attrs:{label:"init"},model:{value:t.init,callback:function(p){t.init=p},expression:"init"}}),t.init?e("pl-popper",{attrs:{trigger:"click"},on:{"click-body":t.onClickBody}},[e("pl-button",{attrs:{label:"click激活"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1):t._e()],1),e("demo-row",{attrs:{title:"自定义reference"},on:{change:function(p){t.$nextTick((function(){return t.reference=t.$refs.button}))}}},[e("pl-button",{ref:"button",attrs:{label:"click激活"}}),e("pl-popper",{attrs:{trigger:"click",reference:t.reference}},[e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])])],1),e("demo-row",{attrs:{title:"自动设置popper大小，在方向上与reference大小对其"}},[e("pl-popper",{attrs:{placement:"top",sizeEqual:""}},[e("pl-button",{staticStyle:{width:"100px",height:"100px"},attrs:{label:"纵向"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{placement:"left",sizeEqual:""}},[e("pl-button",{staticStyle:{width:"100px",height:"100px"},attrs:{label:"横向"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1)],1),e("demo-row",{attrs:{title:"动画"}},[e("pl-popper",{attrs:{transition:"pl-transition-fade",trigger:"click"}},[e("pl-button",{attrs:{label:"fade"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{transition:"pl-transition-scale",trigger:"click"}},[e("pl-button",{attrs:{label:"scale"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{transition:"pl-transition-scale-y",trigger:"click"}},[e("pl-button",{attrs:{label:"scale-y"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{transition:"pl-transition-popper-drop",trigger:"click",arrow:!1,placement:"bottom-start"}},[e("pl-button",{attrs:{label:"popper-drop"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1)],1),e("demo-row",{attrs:{title:"测试show以及open的区别"}},[e("div",[t._v("flag:"+t._s(t.flag))]),e("div",[t._v("open:"+t._s(t.open))]),e("pl-checkbox",{attrs:{label:"open"},model:{value:t.flag,callback:function(p){t.flag=p},expression:"flag"}}),e("pl-popper",{attrs:{transition:"pl-transition-scale-y",trigger:"click",open:t.open},on:{input:function(p){return t.$plain.log("111",p)},"update:open":function(p){t.open=p},open:function(p){return t.$plain.log("open")},close:function(p){return t.$plain.log("close")}},model:{value:t.flag,callback:function(p){t.flag=p},expression:"flag"}},[e("pl-button",{attrs:{label:"scale-y"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1)],1),e("demo-row",{attrs:{title:"综合测试"}},[e("demo-line",{staticStyle:{height:"100px"},attrs:{title:"测试目标"}},[e("pl-popper",{attrs:{transition:t.test.animation,trigger:"manual",arrow:t.test.arrow,placement:t.test.direction+"-"+t.test.align,value:t.test.show}},[e("pl-button",{attrs:{label:"popper-drop"},on:{click:function(p){t.test.show=!t.test.show}}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                    这里是popper的内容\n                ")])],1)],1),e("demo-line",{attrs:{title:"direction"}},[e("pl-button-group",t._l(t.directions,(function(p){return e("pl-button",{key:p,attrs:{label:p,active:p===t.test.direction},on:{click:function(e){t.test.direction=p}}})})),1)],1),e("demo-line",{attrs:{title:"align"}},[e("pl-button-group",t._l(t.aligns,(function(p){return e("pl-button",{key:p,attrs:{label:p,active:p===t.test.align},on:{click:function(e){t.test.align=p}}})})),1)],1),e("demo-line",{attrs:{title:"animation"}},[e("pl-button-group",t._l(t.animations,(function(p){return e("pl-button",{key:p,attrs:{label:p,active:p===t.test.animation},on:{click:function(e){t.test.animation=p}}})})),1)],1),e("demo-line",{attrs:{title:"arrow"}},[e("pl-checkbox",{model:{value:t.test.arrow,callback:function(p){t.$set(t.test,"arrow",p)},expression:"test.arrow"}})],1)],1),e("demo-row",{attrs:{title:"宽高"}},[e("pl-popper",{attrs:{width:150,height:200,trigger:"click"}},[e("pl-button",{attrs:{label:"150:number,200:number"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1),e("pl-popper",{attrs:{width:"150px",height:"200",trigger:"click"}},[e("pl-button",{attrs:{label:"150px:string,200:string"}}),e("div",{staticClass:"demo-popper-content",attrs:{slot:"popper"},slot:"popper"},[t._v("\n                这里是popper的内容\n            ")])],1)],1)],1)},r=[],n=e("48d7"),l={name:"demo-popper",mixins:[n["a"]],props:{},data:function(){return{init:!1,reference:null,flag:!1,open:!1,test:{show:!0,direction:"bottom",align:"start",arrow:!1,animation:"pl-transition-popper-drop"},directions:["top","bottom","left","right"],aligns:["start","center","end"],animations:["pl-transition-fade","pl-transition-scale","pl-transition-scale-y","pl-transition-popper-drop"]}},mounted:function(){this.reference=this.$refs.button},methods:{onClickBody:function(){console.log("onClickBody")}}},s=l,a=(e("486d"),e("2877")),i=Object(a["a"])(s,o,r,!1,null,null,null);p["default"]=i.exports}}]);
//# sourceMappingURL=chunk-39874545.fb3d7890.js.map