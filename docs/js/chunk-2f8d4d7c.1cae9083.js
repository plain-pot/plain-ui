(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2f8d4d7c"],{"023b":function(e,a,t){"use strict";var l=t("310f"),o=t.n(l);o.a},"2cfe":function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"form-multi-column"},[t("demo-row",{attrs:{title:"单列表单"}},[t("pl-form",{attrs:{column:"1"}},[t("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),"Y"===e.formData.oldFlag?t("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[t("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),t("span",{attrs:{slot:"suffix"},slot:"suffix"},[t("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1):e._e(),"Y"===e.formData.oldFlag?t("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[t("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),t("span",[e._v(" 至 ")]),t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1):e._e(),t("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[t("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[t("pl-radio",{attrs:{label:"老客户",val:"Y"}}),t("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),t("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[t("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[t("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),t("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),t("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),t("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),t("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[t("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return t("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),t("pl-form-item",{attrs:{label:"备注",field:"comments"}},[t("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),t("pl-form-item",{attrs:{label:" "}},[t("pl-button",{attrs:{mode:"stroke",label:"取消"}}),t("pl-button",{attrs:{label:"保存"}})],1)],1)],1),t("demo-row",{attrs:{title:"双列表单"}},[t("pl-form",{attrs:{column:"2"}},[t("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[t("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),t("span",{attrs:{slot:"suffix"},slot:"suffix"},[t("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),t("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[t("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),t("span",[e._v(" 至 ")]),t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[t("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return t("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),t("pl-form-item",{attrs:{label:"备注",field:"comments",block:""}},[t("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),t("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[t("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[t("pl-radio",{attrs:{label:"老客户",val:"Y"}}),t("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),t("pl-form-item"),t("pl-form-item",{attrs:{label:" "}},[t("pl-button",{attrs:{mode:"stroke",label:"取消"}}),t("pl-button",{attrs:{label:"保存"}})],1)],1)],1),t("demo-row",{attrs:{title:"三列表单"}},[t("pl-form",{attrs:{column:"3",contentWidth:"200"}},[t("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[t("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),t("span",{attrs:{slot:"suffix"},slot:"suffix"},[t("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),t("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[t("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),t("span",[e._v(" 至 ")]),t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[t("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[t("pl-radio",{attrs:{label:"老客户",val:"Y"}}),t("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),t("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[t("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[t("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),t("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),t("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),t("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),t("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[t("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return t("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),t("pl-form-item",{attrs:{label:"备注",field:"comments",column:"2"}},[t("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),t("pl-form-item",{attrs:{label:" "}},[t("pl-button",{attrs:{mode:"stroke",label:"取消"}}),t("pl-button",{attrs:{label:"保存"}})],1)],1)],1),t("demo-row",{attrs:{title:"四列表单"}},[t("pl-form",{attrs:{column:"4",contentWidth:"150"}},[t("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[t("pl-number",{model:{value:e.formData.type,callback:function(a){e.$set(e.formData,"type",a)},expression:"formData.type"}}),t("span",{attrs:{slot:"suffix"},slot:"suffix"},[t("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),t("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[t("pl-input",{model:{value:e.formData.joinTime,callback:function(a){e.$set(e.formData,"joinTime",a)},expression:"formData.joinTime"}}),t("span",[e._v(" 至 ")]),t("pl-input",{model:{value:e.formData.name,callback:function(a){e.$set(e.formData,"name",a)},expression:"formData.name"}})],1),t("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[t("pl-radio-group",{attrs:{itemWidth:"100%"},model:{value:e.formData.oldFlag,callback:function(a){e.$set(e.formData,"oldFlag",a)},expression:"formData.oldFlag"}},[t("pl-radio",{attrs:{label:"老客户",val:"Y"}}),t("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),t("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[t("pl-checkbox-group",{attrs:{itemWidth:"100%"},model:{value:e.formData.properties,callback:function(a){e.$set(e.formData,"properties",a)},expression:"formData.properties"}},[t("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),t("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),t("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),t("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),t("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[t("pl-select",{model:{value:e.formData.level,callback:function(a){e.$set(e.formData,"level",a)},expression:"formData.level"}},e._l(e.levelData,(function(e){return t("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),t("pl-form-item",{attrs:{label:"备注",field:"comments",column:"2"}},[t("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(a){e.$set(e.formData,"comments",a)},expression:"formData.comments"}})],1),t("pl-form-item",{attrs:{label:" "}},[t("pl-button",{attrs:{mode:"stroke",label:"取消"}}),t("pl-button",{attrs:{label:"保存"}})],1)],1)],1)],1)},o=[],r={name:"form-multi-column",props:{},data:function(){return{formData:{oldFlag:"Y"},levelData:[{levelName:"一级",code:"1"},{levelName:"二级",code:"2"},{levelName:"三级",code:"3"}]}},methods:{}},m=r,i=(t("023b"),t("2877")),s=Object(i["a"])(m,l,o,!1,null,null,null);a["default"]=s.exports},"310f":function(e,a,t){}}]);
//# sourceMappingURL=chunk-2f8d4d7c.1cae9083.js.map