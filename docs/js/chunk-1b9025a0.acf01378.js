(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["chunk-1b9025a0"],{"36bd":function(t,n,e){"use strict";var r=e("4bf8"),l=e("77f1"),i=e("9def");t.exports=function(t){var n=r(this),e=i(n.length),o=arguments.length,c=l(o>1?arguments[1]:void 0,e),a=o>2?arguments[2]:void 0,u=void 0===a?e:l(a,e);while(u>c)n[c++]=t;return n}},"6c7b":function(t,n,e){var r=e("5ca1");r(r.P,"Array",{fill:e("36bd")}),e("9c6c")("fill")},e229:function(t,n,e){"use strict";e("6c7b");var r={data:function(){var t=new Array(50).fill(null).reduce((function(t,n,e){return t[e]=null,t}),{});return{status:["primary","success","warn","error","info"],shapes:["fillet","round","square"],sizes:["mini","normal","large"],aligns:["left","center","right"],val:t}},methods:{log:function(){var t;(t=console).log.apply(t,arguments)}}};n["a"]=r},f98e:function(t,n,e){"use strict";e.r(n);var r=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"notice-service"},[e("demo-row",{attrs:{title:"基本用法"}},[e("pl-button",{attrs:{label:"notice"},on:{click:function(n){return t.$notice("保存成功！")}}})],1),e("demo-row",{attrs:{title:"状态"}},[t._l(t.status,(function(n){return e("pl-button",{key:n,attrs:{status:n,label:n},on:{click:function(e){return t.$notice[n]("正在操作中！")}}})})),e("pl-button",{attrs:{label:"无状态"},on:{click:function(n){return t.$notice("正在操作中！",{status:null})}}})],2),e("demo-row",{attrs:{title:"关闭事件"}},[e("pl-button",{attrs:{label:"不自动关闭"},on:{click:function(n){return t.$notice("保存成功！",{time:null})}}}),e("pl-button",{attrs:{label:"1s"},on:{click:function(n){return t.$notice("保存成功！",{time:1e3})}}}),e("pl-button",{attrs:{label:"2s"},on:{click:function(n){return t.$notice("保存成功！",{time:2e3})}}})],1),e("demo-row",{attrs:{title:"监听点击事件"}},[e("pl-button",{attrs:{label:"notice"},on:{click:t.handleClick}})],1),e("demo-row",{attrs:{title:"自定义内容"}},[e("pl-button",{attrs:{label:"custom render"},on:{click:t.customRender}}),e("pl-input",{model:{value:t.val[0],callback:function(n){t.$set(t.val,0,n)},expression:"val[0]"}})],1),e("demo-row",{attrs:{title:"位置"}},[e("pl-button",{attrs:{label:"top left"},on:{click:function(n){return t.$notice("正在操作中！",{vertical:"start",horizontal:"start"})}}}),e("pl-button",{attrs:{label:"top right"},on:{click:function(n){return t.$notice("正在操作中！",{vertical:"start",horizontal:"end"})}}}),e("pl-button",{attrs:{label:"bottom left"},on:{click:function(n){return t.$notice("正在操作中！",{vertical:"end",horizontal:"start"})}}}),e("pl-button",{attrs:{label:"bottom right"},on:{click:function(n){return t.$notice("正在操作中！",{vertical:"end",horizontal:"end"})}}})],1)],1)},l=[],i=(e("96cf"),e("3b8d")),o=e("e229"),c={name:"notice-service",mixins:[o["a"]],data:function(){return{val:{0:null}}},methods:{handleClick:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$notice("点击事件",{time:null,noClose:!0,onClick:function(){n.close()}});case 2:n=t.sent;case 3:case"end":return t.stop()}}),t,this)})));function n(){return t.apply(this,arguments)}return n}(),customRender:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var n,e=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:n=this.$createElement,this.$notice({render:function(){return n("pl-input",{attrs:{value:e.val[0]},on:{input:function(t){return e.val[0]=t}}})},time:null});case 2:case"end":return t.stop()}}),t,this)})));function n(){return t.apply(this,arguments)}return n}()}},a=c,u=e("2877"),s=Object(u["a"])(a,r,l,!1,null,null,null);n["default"]=s.exports}}]);
//# sourceMappingURL=chunk-1b9025a0.acf01378.js.map