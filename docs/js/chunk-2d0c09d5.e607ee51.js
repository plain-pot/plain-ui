(window["webpackJsonp_main-application_project"]=window["webpackJsonp_main-application_project"]||[]).push([["chunk-2d0c09d5"],{4311:function(e,t,n){"use strict";n.r(t);n("a15b"),n("d81d"),n("b0c0");var a=n("7a23"),c={class:"tree-table-virtual-draggable"};function r(e,t,n,r,l,b){var u=Object(a["B"])("pl-button"),i=Object(a["B"])("pl-button-group"),o=Object(a["B"])("demo-line"),d=Object(a["B"])("plc-index"),j=Object(a["B"])("plc-tree"),f=Object(a["B"])("plc"),O=Object(a["B"])("pl-table");return Object(a["w"])(),Object(a["g"])("div",c,[Object(a["k"])(o,null,{default:Object(a["J"])((function(){return[Object(a["k"])(i,null,{default:Object(a["J"])((function(){return[Object(a["k"])(u,{label:"全部展开",onClick:t[1]||(t[1]=function(t){return e.$refs.tree.expandAll()})}),Object(a["k"])(u,{label:"全部收起",onClick:t[2]||(t[2]=function(t){return e.$refs.tree.collapseAll()})}),Object(a["k"])(u,{label:"获取选中数据",onClick:t[3]||(t[3]=function(t){return e.$message(e.$refs.tree.getCheckedData().map((function(e){var t=e.data;return t.name})).join(","))})})]})),_:1})]})),_:1}),Object(a["k"])(O,{data:l.tableData,keyField:"code",childrenField:"children",virtual:"",showCheckbox:""},{default:Object(a["J"])((function(){return[Object(a["k"])(d),Object(a["k"])(j,{ref:"tree",rowDraggable:""},{content:Object(a["J"])((function(e){var t=e.row;return[Object(a["j"])(Object(a["D"])(t.name),1)]})),_:1},512),Object(a["k"])(f,{title:"名称",field:"id"}),Object(a["k"])(f,{title:"名称",field:"name"})]})),_:1},8,["data"])])}n("d3b7");var l=n("2909"),b=(n("96cf"),n("1da1")),u={name:"tree-table-virtual-draggable",data:function(){return{tableData:[]}},mounted:function(){var e=this;return Object(b["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,n.e("chunk-2d2300f7").then(n.t.bind(null,"eb59",3));case 2:a=t.sent.default,e.tableData=Object(l["a"])(a);case 4:case"end":return t.stop()}}),t)})))()}};u.render=r;t["default"]=u}}]);
//# sourceMappingURL=chunk-2d0c09d5.e607ee51.js.map