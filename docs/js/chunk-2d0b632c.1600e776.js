(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b632c"],{"1baf":function(e,a,l){"use strict";l.r(a);var t=function(){var e=this,a=e.$createElement,l=e._self._c||a;return l("div",{staticClass:"form-size"},[l("demo-row",{attrs:{title:"大尺寸"}},[l("pl-form",{attrs:{size:"large"}},[l("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[l("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),l("span",{attrs:{slot:"suffix"},slot:"suffix"},[l("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),l("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[l("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),l("span",[e._v(" 至 ")]),l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[l("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[l("pl-radio",{attrs:{label:"老客户",val:"Y"}}),l("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),l("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[l("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[l("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),l("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),l("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),l("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),l("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[l("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return l("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),l("pl-form-item",{attrs:{label:"备注",field:"comments"}},[l("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),l("pl-form-item",{attrs:{label:" "}},[l("pl-button",{attrs:{mode:"stroke",label:"取消"}}),l("pl-button",{attrs:{label:"保存"}})],1)],1)],1),l("demo-row",{attrs:{title:"中等尺寸"}},[l("pl-form",{attrs:{size:"normal"}},[l("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[l("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),l("span",{attrs:{slot:"suffix"},slot:"suffix"},[l("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),l("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[l("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),l("span",[e._v(" 至 ")]),l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[l("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[l("pl-radio",{attrs:{label:"老客户",val:"Y"}}),l("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),l("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[l("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[l("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),l("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),l("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),l("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),l("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[l("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return l("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),l("pl-form-item",{attrs:{label:"备注",field:"comments"}},[l("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),l("pl-form-item",{attrs:{label:" "}},[l("pl-button",{attrs:{mode:"stroke",label:"取消"}}),l("pl-button",{attrs:{label:"保存"}})],1)],1)],1),l("demo-row",{attrs:{title:"小尺寸"}},[l("pl-form",{attrs:{size:"mini"}},[l("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[l("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),l("span",{attrs:{slot:"suffix"},slot:"suffix"},[l("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),l("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[l("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),l("span",[e._v(" 至 ")]),l("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),l("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[l("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[l("pl-radio",{attrs:{label:"老客户",val:"Y"}}),l("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),l("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[l("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[l("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),l("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),l("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),l("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),l("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[l("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return l("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),l("pl-form-item",{attrs:{label:"备注",field:"comments"}},[l("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),l("pl-form-item",{attrs:{label:" "}},[l("pl-button",{attrs:{mode:"stroke",label:"取消"}}),l("pl-button",{attrs:{label:"保存"}})],1)],1)],1)],1)},o=[],r={name:"form-size",props:{},data:function(){return{formData:{oldFlag:"Y"},levelData:[{levelName:"一级",code:"1"},{levelName:"二级",code:"2"},{levelName:"三级",code:"3"}]}},methods:{}},m=r,s=l("2877"),i=Object(s["a"])(m,t,o,!1,null,null,null);a["default"]=i.exports}}]);
//# sourceMappingURL=chunk-2d0b632c.1600e776.js.map