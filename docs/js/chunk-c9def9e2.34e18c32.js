(window["webpackJsonp_main-application-project"]=window["webpackJsonp_main-application-project"]||[]).push([["chunk-c9def9e2"],{"0710":function(t,e,c){"use strict";c("5fe3")},"5fe3":function(t,e,c){},"823d":function(t,e,c){"use strict";c.r(e);c("b0c0");var l=c("5530"),a=c("7a23"),i={class:"demo-virtual-list"},n={class:"demo-virtual-list-container"},s={class:"content"},o={class:"label"},d={class:"star"},r={class:"demo-virtual-list-container"},b={class:"seq"},u={class:"content"},j={class:"label"},O={class:"star"},k={class:"demo-virtual-list-container"},v={class:"seq"},f={class:"content"},m={class:"label"},p={class:"star"};function g(t,e,c,g,C,D){var h=Object(a["B"])("pl-virtual-list"),w=Object(a["B"])("demo-row"),y=Object(a["B"])("pl-checkbox");return Object(a["w"])(),Object(a["g"])("div",i,[Object(a["k"])(w,{title:"基本用法"},{default:Object(a["J"])((function(){return[Object(a["k"])("div",n,[Object(a["k"])(h,{data:C.list,size:40},{default:Object(a["J"])((function(t){var e=t.item,c=t.index;return[(Object(a["w"])(),Object(a["g"])("div",{key:c,style:{backgroundColor:e.color,height:"40px"},class:"demo-virtual-list-item",vid:c,onClick:function(t){return D.log(c,Object(l["a"])({},e))}},[Object(a["k"])("div",{class:["seq",D.getClass(e)]},Object(a["D"])(c),3),Object(a["k"])("div",s,[Object(a["k"])("div",o,[Object(a["k"])("span",null,Object(a["D"])(e.name),1),Object(a["k"])("span",null,Object(a["D"])(e.date),1)]),Object(a["k"])("div",d,Object(a["D"])(e.star),1)])],12,["vid","onClick"]))]})),_:1},8,["data"])])]})),_:1}),Object(a["k"])(w,{title:"动态高度"},{default:Object(a["J"])((function(){return[Object(a["k"])("div",r,[Object(a["k"])(h,{data:C.list,size:60,dynamicSize:"",ref:"list"},{default:Object(a["J"])((function(t){var e=t.item,c=t.index;return[(Object(a["w"])(),Object(a["g"])("div",{key:c,style:{backgroundColor:e.color,height:"".concat(e.size,"px")},class:"demo-virtual-list-item",vid:c,onClick:function(t){return D.onClick(e,c)}},[Object(a["k"])("div",b,Object(a["D"])(c),1),Object(a["k"])("div",u,[Object(a["k"])("div",j,[Object(a["k"])("span",null,Object(a["D"])(e.name),1),Object(a["k"])("span",null,Object(a["D"])(e.date),1)]),Object(a["k"])("div",O,Object(a["D"])(e.star),1)])],12,["vid","onClick"]))]})),_:1},8,["data"])])]})),_:1}),Object(a["k"])(w,{title:"禁用虚拟滚动"},{default:Object(a["J"])((function(){return[Object(a["k"])(y,{modelValue:C.disabledVirtualScroll,"onUpdate:modelValue":e[1]||(e[1]=function(t){return C.disabledVirtualScroll=t}),label:"禁用虚拟滚动"},null,8,["modelValue"]),Object(a["k"])("div",k,[Object(a["k"])(h,{data:C.data2,size:40,disabled:C.disabledVirtualScroll},{default:Object(a["J"])((function(t){var e=t.item,c=t.index;return[(Object(a["w"])(),Object(a["g"])("div",{key:c,style:{backgroundColor:e.color,height:"40px"},class:"demo-virtual-list-item",vid:c,onClick:function(t){return D.log(c,Object(l["a"])({},e))}},[Object(a["k"])("div",v,Object(a["D"])(c),1),Object(a["k"])("div",f,[Object(a["k"])("div",m,[Object(a["k"])("span",null,Object(a["D"])(e.name),1),Object(a["k"])("span",null,Object(a["D"])(e.date),1)]),Object(a["k"])("div",p,Object(a["D"])(e.star),1)])],12,["vid","onClick"]))]})),_:1},8,["data","disabled"])])]})),_:1})])}c("fb6a"),c("a500");var C=c("5f00"),D={name:"demo-virtual-list",props:{},data:function(){return{list:C.slice(0,188),data2:C,disabledVirtualScroll:!1}},methods:{onClick:function(t,e){console.log(this.$refs.list.adjust)},log:function(){var t;(t=console).log.apply(t,arguments)},getClass:function(t){return console.log("item",t),{}}},mounted:function(){}};c("0710");D.render=g;e["default"]=D}}]);
//# sourceMappingURL=chunk-c9def9e2.34e18c32.js.map