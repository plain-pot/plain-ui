(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d7692"],{7762:function(e,a,l){"use strict";l.r(a);var t=function(){var e=this,a=e.$createElement,l=e._self._c||a;return l("div",{staticClass:"demo-cascade"},[l("demo-row",{attrs:{title:"cascade-panel"}},[l("demo-row",{attrs:{title:"基本用法"}},[l("demo-line",[e._v(" "+e._s(e.val[0])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:e.label?"id":"name",keyField:"id",childrenField:"subs"},model:{value:e.val[0],callback:function(a){e.$set(e.val,0,a)},expression:"val[0]"}})],1),l("demo-row",{attrs:{title:"cascade-panel: 懒加载"}},[l("demo-line",[e._v(" "+e._s(e.val[1])+" ")]),l("pl-cascade-panel",{attrs:{labelField:"name",keyField:"id",childrenField:"subs",lazy:"",isLeaf:e.lazyDemo.isLeaf,getChildren:e.lazyDemo.getChildren},model:{value:e.val[1],callback:function(a){e.$set(e.val,1,a)},expression:"val[1]"}})],1),l("demo-row",{attrs:{title:"cascade-panel: 懒加载，有默认值"}},[l("demo-line",[e._v(" "+e._s(e.val[11])+" ")]),l("pl-cascade-panel",{attrs:{labelField:"name",keyField:"id",childrenField:"subs",lazy:"",isLeaf:e.lazyDemo.isLeaf,getChildren:e.lazyDemo.getChildren},model:{value:e.val[11],callback:function(a){e.$set(e.val,11,a)},expression:"val[11]"}})],1),l("demo-row",{attrs:{title:"cascade-panel: init value"}},[l("demo-line",[e._v(" "+e._s(e.val[2])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},model:{value:e.val[2],callback:function(a){e.$set(e.val,2,a)},expression:"val[2]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:hover 触发器"}},[l("demo-line",[e._v(" "+e._s(e.val[3])+" ")]),l("pl-cascade-panel",{attrs:{trigger:"hover",data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},model:{value:e.val[3],callback:function(a){e.$set(e.val,3,a)},expression:"val[3]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:禁用部分选项"}},[l("demo-line",[e._v(" 禁用掉叶子节点，并且节点名称中含有[2]的节点 ")]),l("demo-line",[e._v(" "+e._s(e.val[4])+" ")]),l("pl-cascade-panel",{attrs:{nodeDisabled:e.nodeDisabled,data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},model:{value:e.val[4],callback:function(a){e.$set(e.val,4,a)},expression:"val[4]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:自定义内容-作用域插槽"}},[l("demo-line",[e._v(" "+e._s(e.val[5])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},scopedSlots:e._u([{key:"default",fn:function(e){var a=e.node,t=e.index;return[l("cascade-item",{attrs:{node:a,index:t}})]}}]),model:{value:e.val[5],callback:function(a){e.$set(e.val,5,a)},expression:"val[5]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:自定义内容-渲染函数"}},[l("demo-line",[e._v(" "+e._s(e.val[5])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",renderContent:e.renderContent},model:{value:e.val[5],callback:function(a){e.$set(e.val,5,a)},expression:"val[5]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:点击分支的时候也能触发change"}},[l("demo-line",[e._v(" "+e._s(e.val[6])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",selectBranch:""},model:{value:e.val[6],callback:function(a){e.$set(e.val,6,a)},expression:"val[6]"}})],1),l("demo-row",{attrs:{title:"cascade-panel:筛选文本以及自定义筛选函数"}},[l("demo-line",[l("pl-input",{model:{value:e.filterText,callback:function(a){e.filterText=a},expression:"filterText"}})],1),l("demo-line",[e._v(" "+e._s(e.val[6])+" ")]),l("pl-cascade-panel",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",filterText:e.filterText,filterMethod:e.filterMethod},model:{value:e.val[6],callback:function(a){e.$set(e.val,6,a)},expression:"val[6]"}})],1)],1),l("demo-row",{attrs:{title:"cascade-service"}},[l("demo-row",{attrs:{title:"cascade service：基本用法"}},[l("pl-button",{ref:"test0",attrs:{label:"open cascade"},on:{click:function(a){return e.test0.toggle()}}})],1),l("demo-row",{attrs:{title:"cascade service：懒加载"}},[l("pl-button",{ref:"lazyTest",attrs:{label:"open cascade"},on:{click:function(a){return e.lazyTest.toggle()}}})],1)],1),l("demo-row",{attrs:{title:"pl-cascade"}},[l("demo-row",{attrs:{title:"基本用法"}},[l("demo-line",[e._v(" "+e._s(e.val[7])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},on:{focus:function(a){return e.$plain.log("focus")},blur:function(a){return e.$plain.log("blur")}},model:{value:e.val[7],callback:function(a){e.$set(e.val,7,a)},expression:"val[7]"}})],1),l("demo-row",{attrs:{title:"禁用选项"}},[l("demo-line",[e._v(" "+e._s(e.val[7])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",nodeDisabled:e.nodeDisabled},model:{value:e.val[7],callback:function(a){e.$set(e.val,7,a)},expression:"val[7]"}})],1),l("demo-row",{attrs:{title:"只显示最后一级文本"}},[l("demo-line",[e._v(" "+e._s(e.val[8])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",showLast:""},model:{value:e.val[8],callback:function(a){e.$set(e.val,8,a)},expression:"val[8]"}})],1),l("demo-row",{attrs:{title:"可以选择分支（可以选择非叶子节点）"}},[l("demo-line",[e._v(" "+e._s(e.val[9])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",selectBranch:""},model:{value:e.val[9],callback:function(a){e.$set(e.val,9,a)},expression:"val[9]"}})],1),l("demo-row",{attrs:{title:"动态加载"}},[l("demo-line",[e._v(" "+e._s(e.formData)+" ")]),l("pl-cascade",{attrs:{value:[e.formData.level1Key,e.formData.level2Key,e.formData.level3Key],showFormat:e.showFormat,labelField:"name",keyField:"id",childrenField:"subs",lazy:"",getChildren:e.lazyDemo.getChildren,isLeaf:e.lazyDemo.isLeaf},on:{change:e.onCascadeChange}}),l("pl-cascade",{attrs:{value:[e.formData.level1Key,e.formData.level2Key,e.formData.level3Key],showFormat:e.showFormat,labelField:"name",keyField:"id",childrenField:"subs",lazy:"",getChildren:e.lazyDemo.getChildren,isLeaf:e.lazyDemo.isLeaf},on:{change:e.onCascadeChange}})],1),l("demo-row",{attrs:{title:"输入筛选"}},[l("demo-line",[e._v(" "+e._s(e.val[10])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",filterable:""},model:{value:e.val[10],callback:function(a){e.$set(e.val,10,a)},expression:"val[10]"}})],1),l("demo-row",{attrs:{title:"自定义节点内容"}},[l("demo-line",[e._v(" "+e._s(e.val[12])+" ")]),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs"},scopedSlots:e._u([{key:"default",fn:function(a){var l=a.node,t=a.index;return[e._v(" "+e._s(t+1)+"、"+e._s(l.data.name)+" ")]}}]),model:{value:e.val[12],callback:function(a){e.$set(e.val,12,a)},expression:"val[12]"}})],1),l("demo-row",{attrs:{title:"禁用以及只读"}},[l("demo-line",{attrs:{title:"禁用"}},[l("pl-checkbox",{attrs:{label:"禁用"},model:{value:e.flag.disabled,callback:function(a){e.$set(e.flag,"disabled",a)},expression:"flag.disabled"}}),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",disabled:e.flag.disabled},model:{value:e.val[13],callback:function(a){e.$set(e.val,13,a)},expression:"val[13]"}})],1),l("demo-line",{attrs:{title:"只读"}},[l("pl-checkbox",{attrs:{label:"只读"},model:{value:e.flag.readonly,callback:function(a){e.$set(e.flag,"readonly",a)},expression:"flag.readonly"}}),l("pl-cascade",{attrs:{data:e.treeData,labelField:"name",keyField:"id",childrenField:"subs",readonly:e.flag.readonly},model:{value:e.val[13],callback:function(a){e.$set(e.val,13,a)},expression:"val[13]"}})],1)],1)],1)],1)},n=[],i=(l("4de4"),l("c975"),l("a15b"),l("d81d"),l("45fc"),l("b0c0"),l("d3b7"),l("25f0"),l("96cf"),l("1da1")),s=l("5530"),d=l("2909"),r={props:{node:{},index:{}},render:function(e){return e("div",[this.index,", ",this.node.label])},mounted:function(){console.log("mounted",this.node.label)}},o={name:"cascade",props:{},components:{CascadeItem:r},data:function(){var e=this,a=[{id:"1",name:"一级 1",subs:Object(d["a"])([1,2,3,4,5,6,7,8,9,10].map((function(e){return{id:"1-"+e,name:"二级 1-"+e,subs:[{id:"1-".concat(e,"-1"),name:"三级 1-".concat(e,"-1")}]}})))},{id:"2",name:"一级 2",subs:Object(d["a"])([1,2,3,4,5,6,7,8,9,10].map((function(e){return{id:"2-"+e,name:"二级 2-"+e,subs:[{id:"2-".concat(e,"-1"),name:"三级 2-".concat(e,"-1")}]}})))},{id:"3",name:"一级 3",subs:[{id:"3-1",name:"二级 3-1",subs:[{id:"3-1-1",name:"三级 3-1-1"},{id:"3-1-2",name:"三级 3-1-2"}]},{id:"3-2",name:"二级 3-2",subs:[{id:"3-2-1",name:"三级 3-2-1"}]}]}],l={isLeaf:function(e){return e.level>=3},getChildren:function(a,l){if(a)switch(a.level){case 1:e.lazyDemo.getCitiesByParentId(a.data.id).then(l);break;case 2:e.lazyDemo.getCitiesByParentId(a.data.id).then(l);break;default:return null}else e.lazyDemo.getCitiesByParentId(null).then(l)},getCitiesByParentId:function(e){return new Promise((function(a){var l=[{id:"1",name:"广东省",parentId:null,subs:[]},{id:"2",name:"佛山市",parentId:"1",subs:[]},{id:"3",name:"深圳市",parentId:"1",subs:[]},{id:"4",name:"禅城区",parentId:"2",subs:[]},{id:"5",name:"南山区",parentId:"3",subs:[]},{id:"6",name:"湖南省",parentId:null,subs:[]},{id:"7",name:"长沙市",parentId:"6",subs:[]},{id:"8",name:"邵阳市",parentId:"6",subs:[]},{id:"9",name:"天心区",parentId:"7",subs:[]},{id:"11",name:"陕西省",parentId:null,subs:[]}];setTimeout((function(){a(l.filter((function(a){return a.parentId===e})))}),500*Math.random()+500)}))}},t=function(a,l){var t={service:null,option:{props:Object(s["a"])({data:function(){return e.treeData},labelField:"name",keyField:"id",childrenField:"subs",value:null},l),popperProps:{reference:function(){return e.$refs[a]}},listener:{change:function(a){e.$message(a.toString()),t.option.props.value=a}}},toggle:function(){var a=Object(i["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(t.service){a.next=4;break}return a.next=3,e.$plain.$cascade(t.option);case 3:t.service=a.sent;case 4:t.service.toggle();case 5:case"end":return a.stop()}}),a)})));function l(){return a.apply(this,arguments)}return l}()};return t},n=t("test0",{renderContent:function(){return e.renderContent.apply(e,arguments)}}),r=t("lazyTest",{lazy:!0,isLeaf:l.isLeaf,getChildren:l.getChildren,data:null});return{label:!1,treeData:a,lazyDemo:l,val:{11:["6","7","9"],2:["2","2-1","2-1-1"]},test0:n,lazyTest:r,filterText:null,filterMethod:function(e,a){return e.some((function(e){return e.key.indexOf(a)>-1}))},formData:{level1Name:"广东省",level1Key:"1",level2Name:"深圳市",level2Key:"3",level3Name:"南山区",level3Key:"5"},flag:{disabled:!0,readonly:!0}}},methods:{isLeaf:function(e){return e.level>3},nodeDisabled:function(e){return e.isLeaf&&e.label.indexOf("2")>0},renderContent:function(e,a){var l=a.node,t=a.index;return e("div",[e(r,{attrs:{node:l,index:t}})])},onCascadeChange:function(e,a){console.log("onCascadeChange",e,a),e?(this.formData.level1Name=a[0].data.name,this.formData.level1Key=e[0],this.formData.level2Name=a[1].data.name,this.formData.level2Key=e[1],this.formData.level3Name=a[2].data.name,this.formData.level3Key=e[2]):(this.formData.level1Name=null,this.formData.level1Key=null,this.formData.level2Name=null,this.formData.level2Key=null,this.formData.level3Name=null,this.formData.level3Key=null)},showFormat:function(){return[this.formData.level1Name,this.formData.level2Name,this.formData.level3Name].filter((function(e){return!!e})).join(" / ")}}},c=o,u=l("2877"),m=Object(u["a"])(c,t,n,!1,null,null,null);a["default"]=m.exports}}]);
//# sourceMappingURL=chunk-2d0d7692.452bb511.js.map