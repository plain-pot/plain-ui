(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e1860"],{"7b98":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"virtual-tree-large-data"},[n("demo-line",[n("pl-button-group",[n("pl-button",{attrs:{label:"全部展开"},on:{click:function(t){return e.$refs.tree1.methods.expandAll()}}}),n("pl-button",{attrs:{label:"全部收起"},on:{click:function(t){return e.$refs.tree1.methods.collapseAll()}}}),n("pl-button",{attrs:{label:"当前选中节点"},on:{click:function(t){e.$message(e.$refs.tree1.methods.getCurrent()?e.$refs.tree1.methods.getCurrent().data.name:"未选中任何节点！")}}}),n("pl-button",{attrs:{label:"获取选中的数据"},on:{click:function(t){e.$message(e.$refs.tree1.methods.getCheckedData().map((function(e){return e.name})).join(","),{time:null})}}}),n("pl-button",{attrs:{label:"打印数据"},on:{click:function(t){return e.$plain.log(e.treeData)}}})],1)],1),n("pl-virtual-tree",{ref:"tree1",attrs:{data:e.treeData,defaultExpandAll:"",keyField:"id",labelField:"name",childrenField:"subs",height:"360px",width:"500px",virtual:"",draggable:"",showCheckbox:""},on:{"node-click":function(t){return e.$plain.log(t.data.name)}}})],1)},l=[],r={name:"virtual-tree-large-data",props:{},data:function(){function e(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"0",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,a=[],l=0;l<10;l+=1){var r="".concat(t,"-").concat(l),o={name:r,id:r};n>0&&(o.subs=e(r,n-1)),a.push(o)}return a}var t=e();return{treeData:t}},methods:{}},o=r,u=n("2877"),i=Object(u["a"])(o,a,l,!1,null,null,null);t["default"]=i.exports}}]);
//# sourceMappingURL=chunk-2d0e1860.b4203957.js.map