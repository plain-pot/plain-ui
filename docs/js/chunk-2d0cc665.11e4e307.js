(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0cc665"],{"4e86":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("test-table",{attrs:{data:e.data}})],1)},c=[],r=(n("d81d"),n("b0c0"),n("a6f4")),s=n("d4ec"),i=n("bee2"),u=function(){function e(t,n,a){Object(s["a"])(this,e),this.key=t,this.data=n,this.markGetter=a}return Object(i["a"])(e,[{key:"isChecked",value:function(){return this.markGetter().check.get(this.key)}},{key:"check",value:function(e){this.markGetter().check.set(this.key,e)}}]),e}(),o=n("30aa"),d=n("2202"),l=new o["a"]("test_node"),h=function e(){var t=this;Object(s["a"])(this,e),this.selfGetter=function(){return t},this.node={state:Object(r["l"])({map:{}}),get:function(e){var n=l.get(e),a=t.node.state.map[n];return a?a.data=e:(a=new u(n,e,t.selfGetter),Object(r["n"])(t.node.state.map,n,a)),a},getList:function(e){return e?e.map((function(e){return t.node.get(e)})):[]}},this.check=Object(d["a"])()},f=Object(r["c"])({name:"test-table",props:{data:{type:Array}},setup:function(e){var t=new h,n=Object(r["a"])((function(){return t.node.getList(e.data)}));return function(){return Object(r["e"])("div",{class:"test-table"},[JSON.stringify(t.check.state.map),Object(r["e"])("ul",[n.value.map((function(e){return Object(r["e"])("li",[Object(r["e"])("pl-checkbox",{attrs:{value:e.isChecked(),readonly:!0},on:{click:function(){return e.check(!e.isChecked())}}}),Object(r["e"])("span",[e.key,"-",e.data.name])])}))])])}}}),b={name:"test",components:{TestTable:f},data:function(){return{agent:null,data:[{name:"山东省"},{name:"山西省"},{name:"湖南省"},{name:"湖北省"},{name:"四川省"},{name:"广东省"},{name:"广西省"}]}},mounted:function(){}},k=b,m=n("2877"),p=Object(m["a"])(k,a,c,!1,null,null,null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d0cc665.11e4e307.js.map