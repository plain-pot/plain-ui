(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b21a7"],{"234d":function(e,l,a){"use strict";a.r(l);var t=function(){var e=this,l=e.$createElement,a=e._self._c||l;return a("div",{staticClass:"form-edit-control"},[a("demo-row",{attrs:{title:"父子disabled以及readonly设置"}},[a("demo-line",[a("pl-checkbox",{attrs:{label:"禁用"},model:{value:e.flag.disabled,callback:function(l){e.$set(e.flag,"disabled",l)},expression:"flag.disabled"}}),a("pl-checkbox",{attrs:{label:"只读"},model:{value:e.flag.readonly,callback:function(l){e.$set(e.flag,"readonly",l)},expression:"flag.readonly"}})],1),a("pl-form",{attrs:{disabled:e.flag.disabled,readonly:e.flag.readonly}},[a("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[a("pl-input",{model:{value:e.formData.name,callback:function(l){e.$set(e.formData,"name",l)},expression:"formData.name"}})],1),a("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[a("pl-number",{model:{value:e.formData.type,callback:function(l){e.$set(e.formData,"type",l)},expression:"formData.type"}}),a("span",{attrs:{slot:"suffix"},slot:"suffix"},[a("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),a("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime",disabled:!1}},[a("pl-input",{model:{value:e.formData.joinTime,callback:function(l){e.$set(e.formData,"joinTime",l)},expression:"formData.joinTime"}}),a("span",[e._v(" 至 ")]),a("pl-input",{model:{value:e.formData.name,callback:function(l){e.$set(e.formData,"name",l)},expression:"formData.name"}})],1),a("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag",disabled:!1}},[a("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(l){e.$set(e.formData,"oldFlag",l)},expression:"formData.oldFlag"}},[a("pl-radio",{attrs:{label:"老客户",val:"Y",disabled:""}}),a("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),a("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[a("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(l){e.$set(e.formData,"properties",l)},expression:"formData.properties"}},[a("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),a("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),a("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),a("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),a("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[a("pl-select",{model:{value:e.formData.level,callback:function(l){e.$set(e.formData,"level",l)},expression:"formData.level"}},e._l(e.levelData,(function(e){return a("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),a("pl-form-item",{attrs:{label:"备注",field:"comments"}},[a("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(l){e.$set(e.formData,"comments",l)},expression:"formData.comments"}})],1),a("pl-form-item",{attrs:{label:" "}},[a("pl-button",{attrs:{mode:"stroke",label:"取消"}}),a("pl-button",{attrs:{label:"保存"}})],1)],1)],1),a("demo-row",{attrs:{title:"通过disabledFields控制禁用"}},[a("pl-checkbox-group",{model:{value:e.formDisabledFields,callback:function(l){e.formDisabledFields=l},expression:"formDisabledFields"}},[a("pl-checkbox",{attrs:{label:"客户名称",val:"name"}}),a("pl-checkbox",{attrs:{label:"客户员工数量",val:"type"}}),a("pl-checkbox",{attrs:{label:"客户加入时间",val:"joinTime"}}),a("pl-checkbox",{attrs:{label:"是否老客户",val:"oldFlag"}}),a("pl-checkbox",{attrs:{label:"客户性质",val:"properties"}}),a("pl-checkbox",{attrs:{label:"客户级别",val:"level"}}),a("pl-checkbox",{attrs:{label:"备注",val:"comments"}}),a("pl-checkbox",{attrs:{label:"禁用操作按钮",val:"button"}})],1),a("div",{staticStyle:{margin:"12px 0"}},[e._v(" "+e._s(e.targetFormDisabledFields)+" ")]),a("pl-form",{attrs:{disabledFields:e.targetFormDisabledFields}},[a("pl-form-item",{attrs:{label:"客户名称",field:"name"}},[a("pl-input",{model:{value:e.formData.name,callback:function(l){e.$set(e.formData,"name",l)},expression:"formData.name"}})],1),a("pl-form-item",{attrs:{label:"客户员工数量",field:"type"}},[a("pl-number",{model:{value:e.formData.type,callback:function(l){e.$set(e.formData,"type",l)},expression:"formData.type"}}),a("span",{attrs:{slot:"suffix"},slot:"suffix"},[a("pl-icon",{directives:[{name:"tooltip",rawName:"v-tooltip",value:"整数",expression:"'整数'"}],attrs:{icon:"el-icon-question"}})],1)],1),a("pl-form-item",{attrs:{label:"客户加入时间",field:"joinTime"}},[a("pl-input",{model:{value:e.formData.joinTime,callback:function(l){e.$set(e.formData,"joinTime",l)},expression:"formData.joinTime"}}),a("span",[e._v(" 至 ")]),a("pl-input",{model:{value:e.formData.name,callback:function(l){e.$set(e.formData,"name",l)},expression:"formData.name"}})],1),a("pl-form-item",{attrs:{label:"是否老客户",field:"oldFlag"}},[a("pl-radio-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.oldFlag,callback:function(l){e.$set(e.formData,"oldFlag",l)},expression:"formData.oldFlag"}},[a("pl-radio",{attrs:{label:"老客户",val:"Y"}}),a("pl-radio",{attrs:{label:"非老客户",val:"N"}})],1)],1),a("pl-form-item",{attrs:{label:"客户性质",field:"properties"}},[a("pl-checkbox-group",{attrs:{itemWidth:"50%"},model:{value:e.formData.properties,callback:function(l){e.$set(e.formData,"properties",l)},expression:"formData.properties"}},[a("pl-checkbox",{attrs:{label:"大客户",val:"large"}}),a("pl-checkbox",{attrs:{label:"潜在客户",val:"potential"}}),a("pl-checkbox",{attrs:{label:"长久客户",val:"long"}}),a("pl-checkbox",{attrs:{label:"赢单客户",val:"order"}})],1)],1),a("pl-form-item",{attrs:{label:"客户级别",field:"level"}},[a("pl-select",{model:{value:e.formData.level,callback:function(l){e.$set(e.formData,"level",l)},expression:"formData.level"}},e._l(e.levelData,(function(e){return a("pl-select-option",{key:e.code,attrs:{label:e.levelName,val:e.code}})})),1)],1),a("pl-form-item",{attrs:{label:"备注",field:"comments"}},[a("pl-input",{attrs:{textarea:""},model:{value:e.formData.comments,callback:function(l){e.$set(e.formData,"comments",l)},expression:"formData.comments"}})],1),a("pl-form-item",{attrs:{label:" ",field:"button"}},[a("pl-button",{attrs:{mode:"stroke",label:"取消"}}),a("pl-button",{attrs:{label:"保存"}})],1)],1)],1)],1)},o=[],r=(a("13d5"),{name:"form-edit-control",props:{},data:function(){return{formData:{},levelData:[{levelName:"一级",code:"1"},{levelName:"二级",code:"2"},{levelName:"三级",code:"3"}],formDisabledFields:[],flag:{}}},computed:{targetFormDisabledFields:function(){return this.formDisabledFields.reduce((function(e,l){return e[l]=!0,e}),{})}},methods:{}}),s=r,i=a("2877"),m=Object(i["a"])(s,t,o,!1,null,null,null);l["default"]=m.exports}}]);
//# sourceMappingURL=chunk-2d0b21a7.04d3a2d1.js.map