(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2095db"],{a96c:function(t,n,s){"use strict";s.r(n);var e=function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("div",{staticClass:"table-rowspan"},[s("demo-line",{attrs:{title:"字段值相同则合并行"}}),s("ul",t._l(t.data,(function(n){return s("li",[t._v(" "+t._s(n)+" ")])})),0),s("pl-table",{attrs:{data:t.data,spanMethod:t.spanMethod,border:""}},[s("plc-index"),s("plc",{attrs:{title:"一级标题",field:"first"}}),s("plc",{attrs:{title:"二级标题",field:"second"}}),s("plc",{attrs:{title:"三级标题",field:"third"}})],1)],1)},r=[],i=(s("4160"),s("13d5"),s("5530")),a={name:"table-rowspan",data:function(){var t=[{first:"1",second:"1-1",third:"1-1-1"},{first:"1",second:"1-1",third:"1-1-2"},{first:"1",second:"1-1",third:"1-1-3"},{first:"1",second:"1-2",third:"1-2-1"},{first:"1",second:"1-3",third:"1-3-1"},{first:"2",second:"2-1",third:"2-1-1"},{first:"2",second:"2-1",third:"2-1-2"},{first:"2",second:"2-2",third:"2-2-1"}],n={first:0,second:0,third:0},s=[],e=["first","second"],r=e.reduce((function(t,n){return t[n]=1,t}),{});return t.forEach((function(a,d){var o=Object(i["a"])({},r);0!==d?(e.forEach((function(e){a[e]===t[n[e]][e]?(s[n[e]][e]++,o[e]=0):n[e]=d})),s.push(o)):s.push(o)})),{data:t,spanMap:s}},methods:{spanMethod:function(t){var n=t.tableNode,s=t.plc;return{colspan:1,rowspan:null!=this.spanMap[n.index][s.props.field]?this.spanMap[n.index][s.props.field]:1}}}},d=a,o=s("2877"),c=Object(o["a"])(d,e,r,!1,null,null,null);n["default"]=c.exports}}]);
//# sourceMappingURL=chunk-2d2095db.2a95db91.js.map