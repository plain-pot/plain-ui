(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c551b"],{"3f1c":function(e,t,l){"use strict";l.r(t);var n=l("7a23"),a={class:"demo-slider"};function u(e,t,l,u,o,d){var c=Object(n["B"])("pl-slider"),r=Object(n["B"])("demo-row"),i=Object(n["B"])("pl-button"),b=Object(n["B"])("pl-toggle"),j=Object(n["B"])("demo-line");return Object(n["w"])(),Object(n["g"])("div",a,[Object(n["k"])(r,{title:"基本用法"+o.val0},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:o.val0,"onUpdate:modelValue":t[1]||(t[1]=function(e){return o.val0=e})},null,8,["modelValue"])]})),_:1},8,["title"]),Object(n["k"])(r,{title:"横向纵向，以及对其方式"+o.val1},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{vertical:"",modelValue:o.val1,"onUpdate:modelValue":t[2]||(t[2]=function(e){return o.val1=e})},null,8,["modelValue"]),Object(n["k"])(c,{vertical:"","align-end":"",modelValue:o.val1,"onUpdate:modelValue":t[3]||(t[3]=function(e){return o.val1=e}),onChange:d.onInput},null,8,["modelValue","onChange"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[4]||(t[4]=function(e){return o.val1=e})},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[5]||(t[5]=function(e){return o.val1=e}),"align-end":""},null,8,["modelValue"])]})),_:1},8,["title"]),Object(n["k"])(r,{title:"状态"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[6]||(t[6]=function(e){return o.val1=e}),status:"primary"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[7]||(t[7]=function(e){return o.val1=e}),status:"success"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[8]||(t[8]=function(e){return o.val1=e}),status:"warn"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[9]||(t[9]=function(e){return o.val1=e}),status:"error"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val1,"onUpdate:modelValue":t[10]||(t[10]=function(e){return o.val1=e}),status:"info"},null,8,["modelValue"])]})),_:1}),Object(n["k"])(r,{title:"设置总数"+o.val3},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:o.val3,"onUpdate:modelValue":t[11]||(t[11]=function(e){return o.val3=e}),total:1e3},null,8,["modelValue"])]})),_:1},8,["title"]),Object(n["k"])(r,{title:"设置滑块宽度"+o.val4},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:o.val4,"onUpdate:modelValue":t[12]||(t[12]=function(e){return o.val4=e}),length:"100px"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val4,"onUpdate:modelValue":t[13]||(t[13]=function(e){return o.val4=e}),length:"200px"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val4,"onUpdate:modelValue":t[14]||(t[14]=function(e){return o.val4=e}),length:"300px"},null,8,["modelValue"]),Object(n["k"])(c,{modelValue:o.val4,"onUpdate:modelValue":t[15]||(t[15]=function(e){return o.val4=e}),full:""},null,8,["modelValue"])]})),_:1},8,["title"]),Object(n["k"])(r,{title:"范围选择"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{range:"",start:o.start,"onUpdate:start":t[16]||(t[16]=function(e){return o.start=e}),end:o.end,"onUpdate:end":t[17]||(t[17]=function(e){return o.end=e}),total:200,length:"300px"},null,8,["start","end"]),Object(n["k"])(i,null,{default:Object(n["J"])((function(){return[Object(n["j"])("start:"+Object(n["D"])(o.start),1)]})),_:1}),Object(n["k"])(i,null,{default:Object(n["J"])((function(){return[Object(n["j"])("end:"+Object(n["D"])(o.end),1)]})),_:1})]})),_:1}),Object(n["k"])(r,{title:"禁用tooltip"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{tooltip:!1})]})),_:1}),Object(n["k"])(r,{title:"格式化tooltip"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{tooltipFormatter:function(e){return e+"%"}},null,8,["tooltipFormatter"])]})),_:1}),Object(n["k"])(r,{title:"设置最大最小值"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:50,max:80,min:40}),Object(n["k"])(c,{range:"",start:60,end:90,max:150,min:50,total:200})]})),_:1}),Object(n["k"])(r,{title:"步骤分块"},{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:50,step:10}),Object(n["k"])(c,{range:"",length:"300px",step:10,start:o.start,"onUpdate:start":t[18]||(t[18]=function(e){return o.start=e}),end:o.end,"onUpdate:end":t[19]||(t[19]=function(e){return o.end=e}),total:200},null,8,["start","end"])]})),_:1}),Object(n["k"])(r,{title:"禁用只读"},{default:Object(n["J"])((function(){return[Object(n["k"])(j,null,{default:Object(n["J"])((function(){return[Object(n["k"])(b,{modelValue:o.val[0],"onUpdate:modelValue":t[20]||(t[20]=function(e){return o.val[0]=e})},null,8,["modelValue"])]})),_:1}),Object(n["k"])(j,null,{default:Object(n["J"])((function(){return[Object(n["k"])(c,{modelValue:50,disabled:o.val[0]},null,8,["disabled"]),Object(n["k"])(c,{modelValue:50,readonly:o.val[0]},null,8,["readonly"])]})),_:1})]})),_:1})])}var o={name:"demo-slider",data:function(){return{val:{0:!0},val0:40,val1:20,val2:10,val3:200,val4:20,start:20,end:40}},methods:{onInput:function(e){console.log("vertical align-end",e)}}};o.render=u;t["default"]=o}}]);
//# sourceMappingURL=chunk-2d0c551b.ba1afea3.js.map