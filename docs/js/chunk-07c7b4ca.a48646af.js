(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-07c7b4ca"],{"017a":function(e,t,n){"use strict";n.r(t);n("b0c0");var a=n("7a23"),c={class:"demo-use-scoped-slots"},o=Object(a["k"])("label",{for:"has-demo-use-scoped-slots"},"hasScopedSlots",-1);function r(e,t,n,r,s,u){var d=Object(a["z"])("demo-tree-for-scoped-slots");return Object(a["u"])(),Object(a["g"])("div",c,[Object(a["G"])(Object(a["k"])("input",{type:"checkbox",id:"has-demo-use-scoped-slots","onUpdate:modelValue":t[1]||(t[1]=function(e){return s.hasScopedSlots=e})},null,512),[[a["C"],s.hasScopedSlots]]),o,Object(a["k"])(d,{data:s.data},Object(a["i"])({_:2},[s.hasScopedSlots?{name:"default",fn:Object(a["F"])((function(e){var t=e.node.data,n=e.index;return[Object(a["k"])("button",null,Object(a["B"])(n),1),Object(a["k"])("button",null,Object(a["B"])(t.name),1),Object(a["k"])("button",null,Object(a["B"])(t.val),1)]}))}:void 0]),1032,["data"])])}n("96cf");var s=n("1da1"),u=(n("d81d"),n("a9e3"),n("d4ec")),d=n("7a87"),i=n("f742"),l=function e(t){Object(u["a"])(this,e),this.data=t,this.isExpand=!1,this.isChecked=!1},p=Object(d["a"])({props:{data:{type:Array}},setup:function(e){var t=e.props,n=Object(i["a"])({default:{node:l,index:Number}}),c=n.scopedSlots,o=Object(a["e"])((function(){return(t.data||[]).map((function(e){return new l(e)}))})),r=Object(a["e"])((function(){return["demo-use-scoped-slots-components",{"demo-use-scoped-slots-components-has-default":c.default.isExist()}]}));return{render:function(){return Object(a["k"])("div",{class:r.value},[Object(a["k"])("h1",null,[Object(a["j"])("标题")]),Object(a["k"])("ul",null,[o.value.map((function(e,t){return Object(a["k"])("li",{key:t},[c.default({node:e,index:t},Object(a["k"])("button",null,[JSON.stringify(e.data)]))])}))])])}}}}),b=(n("d3b7"),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise((function(t){setTimeout(t,e)}))});function f(){return m.apply(this,arguments)}function m(){return m=Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,b(500*Math.random()+500);case 2:return e.abrupt("return",[{name:"蛋糕",val:"dangao"},{name:"奶茶",val:"naicha"},{name:"果冻",val:"guodong"},{name:"西瓜",val:"xigua"}]);case 3:case"end":return e.stop()}}),e)}))),m.apply(this,arguments)}var j={name:"demo-use-scoped-slots",components:{DemoTreeForScopedSlots:p},data:function(){return{data:[],hasScopedSlots:!0}},created:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("created"),t.next=3,f();case 3:e.data=t.sent;case 4:case"end":return t.stop()}}),t)})))()}};n("cd2c");j.render=r;t["default"]=j},7494:function(e,t,n){},cd2c:function(e,t,n){"use strict";n("7494")}}]);
//# sourceMappingURL=chunk-07c7b4ca.a48646af.js.map